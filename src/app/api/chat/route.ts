import { NextResponse, type NextRequest } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { MESSAGE_LIMITS } from "@/config";
import { AUTH_ENABLED } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

type ChatMessage = { role: "user" | "assistant"; content: string };

/** Map our roles to Gemini's, dropping anything empty. */
function toGeminiContents(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The assistant is not configured. Add GEMINI_API_KEY to run it." },
      { status: 503 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No message to send." }, { status: 400 });
  }

  // Server-side daily limit. Only enforceable when auth is on and we can read
  // the signed-in user; solo mode skips it.
  let userId: string | null = null;
  if (AUTH_ENABLED) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }
    userId = user.id;

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const plan = profile?.plan === "pro" ? "pro" : "free";
    const limit = MESSAGE_LIMITS[plan];

    const since = new Date();
    since.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("role", "user")
      .gte("created_at", since.toISOString());

    if ((count ?? 0) >= limit) {
      return NextResponse.json(
        {
          error: `Daily limit reached (${limit} messages on the ${plan} plan). Try again tomorrow.`,
        },
        { status: 429 },
      );
    }
  }

  const latestUser = [...messages].reverse().find((m) => m.role === "user");

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: toGeminiContents(messages),
        generationConfig: { temperature: 0.6, maxOutputTokens: 1400 },
      }),
    },
  );

  if (!geminiRes.ok || !geminiRes.body) {
    const detail = await geminiRes.text().catch(() => "");
    console.error("Gemini error", geminiRes.status, detail.slice(0, 300));
    return NextResponse.json(
      { error: "The assistant could not be reached. Try again in a moment." },
      { status: 502 },
    );
  }

  // Re-stream Gemini's SSE as plain text chunks, accumulating the full reply so
  // we can persist the turn once it finishes.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let full = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = geminiRes.body!.getReader();
      let buffer = "";

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const json = trimmed.slice(5).trim();
            if (!json || json === "[DONE]") continue;
            try {
              const parsed = JSON.parse(json);
              const text =
                parsed?.candidates?.[0]?.content?.parts
                  ?.map((p: { text?: string }) => p.text ?? "")
                  .join("") ?? "";
              if (text) {
                full += text;
                controller.enqueue(encoder.encode(text));
              }
            } catch {
              // Partial JSON across chunks; wait for the next slice.
            }
          }
        }
      } catch (err) {
        console.error("Stream error", err);
      } finally {
        controller.close();

        // Persist the turn (best effort) once the reply is complete.
        if (AUTH_ENABLED && userId && latestUser && full.trim()) {
          try {
            const supabase = await createClient();
            await supabase.from("chat_messages").insert([
              { user_id: userId, role: "user", content: latestUser.content },
              { user_id: userId, role: "assistant", content: full },
            ]);
          } catch (err) {
            console.error("History save failed", err);
          }
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
