import { BrandBlock, NavCapsule } from "@/components/Brand";
import { PageShell } from "@/components/Shell";
import { SiteFooter, WarningLine } from "@/components/SiteFooter";
import { ForgotPasswordCard } from "./ForgotPasswordCard";

export const metadata = { title: "Reset Password" };

export default function ForgotPasswordPage() {
  return (
    <PageShell className="flex flex-col gap-7">
      <NavCapsule active="signin" />
      <BrandBlock />
      <ForgotPasswordCard />
      <WarningLine />
      <SiteFooter />
    </PageShell>
  );
}
