import { Wrench } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Utility Tools" };

export default function Page() {
  return (
    <ComingSoon
      title="Utility Tools"
      subtitle="IP, hash, network helpers"
      icon={Wrench}
      blurb="A set of quick helpers for the small conversions that come up mid-assessment: IP and subnet math, hash identification, and encoding tasks."
      planned={["IP and subnet calculators", "Hash identification and encoding", "Base64, URL, and hex converters"]}
    />
  );
}
