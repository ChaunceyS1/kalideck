import type { ReactNode } from "react";
import { cx } from "./ui";

/**
 * Every page sits in the same narrow column: designed at 390px, centered and
 * capped on wider screens so the phone layout stays the source of truth.
 */
export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cx(
        "mx-auto w-full max-w-[430px] px-5 pb-10 pt-6 sm:max-w-[520px]",
        className,
      )}
    >
      {children}
    </main>
  );
}
