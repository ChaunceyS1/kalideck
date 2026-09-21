import { Crown } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Priority Support" };

export default function Page() {
  return (
    <ComingSoon
      title="Priority Support"
      subtitle="Pro members"
      icon={Crown}
      blurb="A faster support queue for Pro members. Billing is not wired up yet, so every account is on the free plan for now."
      planned={[
        "Priority response queue for Pro accounts",
        "Direct line for scope and setup questions",
        "Early access to new modules",
      ]}
    />
  );
}
