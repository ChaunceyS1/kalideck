import { BrandBlock, NavCapsule } from "@/components/Brand";
import { PageShell } from "@/components/Shell";
import { SiteFooter, WarningLine } from "@/components/SiteFooter";
import { ResetPasswordCard } from "./ResetPasswordCard";

export const metadata = { title: "Set A New Password" };

export default function ResetPasswordPage() {
  return (
    <PageShell className="flex flex-col gap-7">
      <NavCapsule active="signin" />
      <BrandBlock />
      <ResetPasswordCard />
      <WarningLine />
      <SiteFooter />
    </PageShell>
  );
}
