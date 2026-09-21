import { Map } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Road Map" };

export default function Page() {
  return (
    <ComingSoon
      title="Road Map"
      subtitle="Zero-to-hero path in 10 phases"
      icon={Map}
      blurb="A structured path from fundamentals to advanced practice across ten phases, with the right tools and drills grouped into each stage."
      planned={["Ten phases from setup to reporting", "Recommended tools per phase", "Progress tracking across the journey"]}
    />
  );
}
