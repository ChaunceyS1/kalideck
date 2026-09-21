import { Suspense } from "react";
import { AppBar } from "@/components/AppBar";
import { PageShell } from "@/components/Shell";
import { Assistant } from "./Assistant";

export const metadata = { title: "AI Assistant" };

export default function AssistantPage() {
  return (
    <PageShell className="flex min-h-dvh flex-col gap-5">
      <AppBar
        title="AI Assistant"
        subtitle="Ask me anything about Kali Linux tools"
        back={{ href: "/tools", label: "Tools" }}
      />
      <Suspense fallback={null}>
        <Assistant />
      </Suspense>
    </PageShell>
  );
}
