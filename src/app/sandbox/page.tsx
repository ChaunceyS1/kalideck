import { SquareTerminal } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Terminal Sandbox" };

export default function Page() {
  return (
    <ComingSoon
      title="Terminal Sandbox"
      subtitle="Practice commands safely"
      icon={SquareTerminal}
      blurb="A guided, in-browser terminal for rehearsing Kali commands against safe mock targets, so you can build muscle memory without touching a real host."
      planned={["Simulated command output for common tools", "Safe mock targets with no real network traffic", "Step-by-step guided exercises"]}
    />
  );
}
