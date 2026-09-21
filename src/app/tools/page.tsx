import { AppBar } from "@/components/AppBar";
import { PageShell } from "@/components/Shell";
import { WarningLine } from "@/components/SiteFooter";
import { ALL_TOOLS, usedCategories } from "@/lib/tools";
import { ToolBrowser } from "./ToolBrowser";

export const metadata = { title: "Kali Tools" };

export default function ToolsPage() {
  return (
    <PageShell className="flex flex-col gap-6">
      <AppBar
        title="Kali Tools"
        subtitle={`${ALL_TOOLS.length} tools with copy-ready commands`}
      />
      <ToolBrowser tools={ALL_TOOLS} categories={usedCategories()} />
      <WarningLine />
    </PageShell>
  );
}
