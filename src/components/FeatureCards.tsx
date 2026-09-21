import Link from "next/link";
import { FEATURES, STATS, TINT_HEX, type Feature } from "@/lib/features";

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function StatChips() {
  return (
    <ul className="flex flex-wrap gap-2">
      {STATS.map((stat) => (
        <li
          key={stat.label}
          className="flex min-w-[calc(50%-0.25rem)] flex-1 items-center justify-center gap-2 rounded-field border border-line/60 bg-surface px-3 py-3"
        >
          <span className="font-mono text-[17px] font-bold text-accent">
            {stat.value}
          </span>
          <span className="font-mono text-[12px] text-muted">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function FeatureCardRow({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  const tint = TINT_HEX[feature.tint];

  return (
    <Link
      href={feature.href}
      className="flex h-[62px] items-center gap-3 overflow-hidden rounded-card border border-line/60 px-3 transition hover:border-accent/50"
      style={{
        backgroundImage: `linear-gradient(135deg, ${hexToRgba(tint, 0.25)} 0%, #15181b 100%)`,
      }}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-line/60"
        style={{ backgroundColor: hexToRgba(tint, 0.45) }}
      >
        <Icon size={18} strokeWidth={2} className="text-ink" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-sans text-[14px] font-semibold text-white">
          {feature.title}
        </span>
        <span className="block truncate font-sans text-[12px] text-muted">
          {feature.subtitle}
        </span>
      </span>
    </Link>
  );
}

export function FeatureCards() {
  return (
    <div className="flex flex-col gap-2">
      {FEATURES.map((feature) => (
        <FeatureCardRow key={feature.href} feature={feature} />
      ))}
    </div>
  );
}
