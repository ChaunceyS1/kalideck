"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";

/** Flatten a React children tree into plain text for the copy button. */
function toText(node: React.ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (typeof node === "object" && "props" in node) {
    return toText((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-3 font-sans text-[14px] leading-relaxed text-ink [&_a]:text-accent [&_a]:underline [&_h1]:text-[17px] [&_h1]:font-semibold [&_h2]:text-[15px] [&_h2]:font-semibold [&_h3]:text-[14px] [&_h3]:font-semibold [&_li]:ml-1 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-1 [&_ol]:pl-5 [&_strong]:text-white [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1 [&_ul]:pl-5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Inline code vs. fenced blocks: react-markdown flags blocks with a
          // language class or a newline.
          code(props) {
            const { children, className } = props;
            const text = toText(children);
            const isBlock = /language-/.test(className ?? "") || text.includes("\n");

            if (!isBlock) {
              return (
                <code className="rounded-[5px] border border-line/60 bg-[#0a1113] px-1.5 py-0.5 font-mono text-[12.5px] text-accent">
                  {children}
                </code>
              );
            }

            return (
              <span className="relative block overflow-hidden rounded-[10px] border border-line/60 bg-[#0a1113]">
                <span className="flex items-center justify-between border-b border-line/60 px-3 py-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    shell
                  </span>
                  <CopyButton value={text.replace(/\n$/, "")} />
                </span>
                <span className="block overflow-x-auto px-3 py-2.5">
                  <code className="whitespace-pre font-mono text-[13px] leading-relaxed text-accent">
                    {children}
                  </code>
                </span>
              </span>
            );
          },
          pre(props) {
            // The code component already renders the block wrapper.
            return <>{props.children}</>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
