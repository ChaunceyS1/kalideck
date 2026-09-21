const GHOST_LINES = [
  "msfconsole",
  "nmap -sV target",
  "gobuster dir",
  "aircrack-ng cap",
  "wordlist",
];

/**
 * Three fixed layers behind every page: a mint glow at the top, a scanline
 * grid, and a slowly drifting wall of ghost terminal text.
 */
export function PageBackdrop() {
  const column = [...GHOST_LINES, ...GHOST_LINES, ...GHOST_LINES, ...GHOST_LINES];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Mint radial glow, top-centered */}
      <div
        className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3"
        style={{
          background:
            "radial-gradient(closest-side, rgba(108,247,173,0.12), rgba(108,247,173,0) 70%)",
        }}
      />

      {/* Ghost terminal text */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-drift will-change-transform">
          {[0, 1].map((block) => (
            <div key={block} className="flex flex-col gap-10 py-10">
              {column.map((line, i) => (
                <div
                  key={`${block}-${i}`}
                  className="whitespace-nowrap font-mono text-[13px] tracking-widest text-accent"
                  style={{
                    opacity: 0.04 + (i % 3) * 0.01,
                    paddingLeft: `${(i % 5) * 18}px`,
                  }}
                >
                  {`$ ${line}   $ ${line}   $ ${line}`}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(232,241,238,0.03) 0px, rgba(232,241,238,0.03) 1px, transparent 1px, transparent 2px)",
        }}
      />
    </div>
  );
}
