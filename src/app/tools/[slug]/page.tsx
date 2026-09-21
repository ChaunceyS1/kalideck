import { notFound } from "next/navigation";
import { AppBar } from "@/components/AppBar";
import { PageShell } from "@/components/Shell";
import { WarningLine } from "@/components/SiteFooter";
import { CopyButton } from "@/components/CopyButton";
import { getTool, getToolSlugs } from "@/lib/tools";
import { ToolWorkspace } from "./ToolWorkspace";

export function generateStaticParams() {
  return getToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  return { title: tool ? tool.name : "Tool" };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <PageShell className="flex flex-col gap-6">
      <AppBar
        title={tool.name}
        subtitle={tool.category}
        back={{ href: "/tools", label: "All tools" }}
      />

      <p className="font-sans text-[14px] leading-relaxed text-ink">
        {tool.long}
      </p>

      {tool.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {tool.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line/60 px-2.5 py-1 font-mono text-[11px] text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Install line */}
      <section className="flex flex-col gap-2">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Install
        </h2>
        <div className="flex items-center gap-2 rounded-card border border-line/60 bg-[#0a1113] px-3 py-2.5">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-ink">
            sudo apt install {tool.apt}
          </code>
          <CopyButton value={`sudo apt install ${tool.apt}`} />
        </div>
      </section>

      {/* Variables + live commands (client) */}
      <ToolWorkspace commands={tool.commands} />

      <WarningLine />
    </PageShell>
  );
}
