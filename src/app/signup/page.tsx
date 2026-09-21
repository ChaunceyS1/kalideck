import { Suspense } from "react";
import { NavCapsule } from "@/components/Brand";
import { BrandBlock } from "@/components/Brand";
import { PageShell } from "@/components/Shell";
import { SiteFooter, WarningLine } from "@/components/SiteFooter";
import { SignUpCard } from "./SignUpCard";

export const metadata = { title: "Create Account" };

export default function SignUpPage() {
  return (
    <PageShell className="flex flex-col gap-7">
      <NavCapsule active="signin" />
      <BrandBlock />
      <Suspense fallback={null}>
        <SignUpCard />
      </Suspense>
      <WarningLine />
      <SiteFooter />
    </PageShell>
  );
}
