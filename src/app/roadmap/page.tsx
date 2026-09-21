import { AppBar } from "@/components/AppBar";
import { PageShell } from "@/components/Shell";
import { WarningLine } from "@/components/SiteFooter";
import { ROADMAP } from "@/lib/roadmap";
import { getTool } from "@/lib/tools";
import { RoadmapView } from "./RoadmapView";

export const metadata = { title: "Road Map" };

export default function RoadmapPage() {
  // Resolve the slugs each phase references into display names, once, on the
  // server, so the client view only needs a lookup table.
  const toolNames: Record<string, string> = {};
  for (const phase of ROADMAP) {
    for (const slug of phase.tools) {
      toolNames[slug] = getTool(slug)?.name ?? slug;
    }
  }

  return (
    <PageShell className="flex flex-col gap-6">
      <AppBar
        title="Road Map"
        subtitle="Zero to hero in 10 phases"
        back={{ href: "/tools", label: "Tools" }}
      />

      <p className="font-sans text-[14px] leading-relaxed text-muted">
        A structured path from a clean lab to a finished report. Work the phases
        in order, tap one to expand it, and check it off as you go. Progress is
        saved on this device.
      </p>

      <RoadmapView toolNames={toolNames} />

      <WarningLine />
    </PageShell>
  );
}
