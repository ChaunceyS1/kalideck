"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import { History, ImageIcon, Plus, Send } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { cx } from "@/components/ui";

type Message = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  { title: "Nmap scanning", text: "How do I run a thorough nmap scan and read the results?" },
  { title: "sqlmap testing", text: "Walk me through testing a URL parameter for SQL injection with sqlmap." },
  { title: "Password cracking", text: "How do I crack a captured hash with hashcat using a wordlist?" },
  { title: "Nikto scanning", text: "How do I scan a web server with nikto and interpret the output?" },
];

function newId() {
  return Math.random().toString(36).slice(2);
}

export function Assistant() {
  const params = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoSentRef = useRef(false);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      setError(null);
      const userMsg: Message = { id: newId(), role: "user", content: trimmed };
      const assistantId = newId();

      const history = [...messages, userMsg];
      setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
      setInput("");
      setBusy(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map(({ role, content }) => ({ role, content })),
          }),
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "The assistant is unavailable right now.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m,
            ),
          );
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
        // Drop the empty assistant bubble on failure.
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setBusy(false);
      }
    },
    [busy, messages],
  );

  // Auto-send the deep-linked ?ask= prompt from the Explain button, once.
  useEffect(() => {
    if (autoSentRef.current) return;
    const ask = params.get("ask");
    if (ask) {
      autoSentRef.current = true;
      void send(ask);
    }
  }, [params, send]);

  // Keep the newest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  const empty = messages.length === 0;

  return (
    <div className="flex flex-1 flex-col">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pb-4"
        style={{ scrollbarWidth: "thin" }}
      >
        {empty ? (
          <div className="flex flex-col gap-4 pt-2">
            <p className="font-sans text-[14px] leading-relaxed text-muted">
              Pick a starter or type your own question. Answers are for
              authorized labs, CTFs, and scoped engagements.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => void send(s.text)}
                  className="rounded-card border border-line/60 bg-surface p-3 text-left transition hover:border-accent/50"
                >
                  <span className="block font-sans text-[13px] font-semibold text-white">
                    {s.title}
                  </span>
                  <span className="mt-1 block font-sans text-[12px] leading-snug text-muted">
                    {s.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-4 pt-2">
            {messages.map((m) => (
              <li
                key={m.id}
                className={cx(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {m.role === "user" ? (
                  <div className="max-w-[85%] rounded-card rounded-br-sm bg-accent/15 px-3.5 py-2.5 font-sans text-[14px] leading-relaxed text-ink">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[92%] rounded-card rounded-bl-sm border border-line/60 bg-surface px-3.5 py-3">
                    {m.content ? (
                      <Markdown content={m.content} />
                    ) : (
                      <span className="inline-flex gap-1 py-1" aria-label="Thinking">
                        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-accent" />
                        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-accent [animation-delay:0.2s]" />
                        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-accent [animation-delay:0.4s]" />
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error ? (
        <p className="mb-2 rounded-field border border-[#7a2b2b]/70 bg-[#1a0f10] px-3 py-2 font-mono text-[12px] text-[#f4a3a3]">
          {error}
        </p>
      ) : null}

      {/* Input bar */}
      <form
        onSubmit={onSubmit}
        className="sticky bottom-3 flex items-center gap-2 rounded-[16px] border border-accent/40 bg-surface p-2 shadow-glow"
      >
        <div className="flex items-center gap-1 pl-1 text-muted">
          <button type="button" aria-label="Attach" className="p-1 hover:text-accent">
            <Plus size={18} />
          </button>
          <button type="button" aria-label="Image" className="p-1 hover:text-accent">
            <ImageIcon size={17} />
          </button>
          <button type="button" aria-label="History" className="p-1 hover:text-accent">
            <History size={17} />
          </button>
        </div>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about a tool or command…"
          className="min-w-0 flex-1 bg-transparent font-sans text-[14px] text-ink placeholder:text-muted/70 outline-none"
        />
        <button
          type="submit"
          disabled={busy || input.trim() === ""}
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-accent text-[#052014] transition hover:brightness-105 disabled:opacity-50"
        >
          <Send size={16} strokeWidth={2.4} />
        </button>
      </form>
    </div>
  );
}
