import seed from "../../../data/tools.seed.json";
import generatedJson from "../../../data/tools.generated.json";
import { CATEGORIES, type Category, type Tool } from "./types";

// The generated file starts as an empty array and is filled by
// scripts/build-tools.sh on a Kali/Debian box, so builds work either way.
const generated = generatedJson as Tool[];

/**
 * Merge generated apt data with the hand-written seed. Seed entries win on any
 * slug conflict, so the curated descriptions and commands always take priority.
 */
function mergeTools(): Tool[] {
  const bySlug = new Map<string, Tool>();
  for (const tool of generated) {
    if (tool?.slug) bySlug.set(tool.slug, tool);
  }
  for (const tool of seed as Tool[]) {
    bySlug.set(tool.slug, tool);
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export const ALL_TOOLS: Tool[] = mergeTools();

export function getTool(slug: string): Tool | undefined {
  return ALL_TOOLS.find((tool) => tool.slug === slug);
}

export function getToolSlugs(): string[] {
  return ALL_TOOLS.map((tool) => tool.slug);
}

/** Categories that actually have at least one tool, in the canonical order. */
export function usedCategories(): Category[] {
  const present = new Set(ALL_TOOLS.map((tool) => tool.category));
  return CATEGORIES.filter((category) => present.has(category));
}

export function toolCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const tool of ALL_TOOLS) {
    counts[tool.category] = (counts[tool.category] ?? 0) + 1;
  }
  return counts;
}

export { CATEGORIES };
export type { Category, Tool };
