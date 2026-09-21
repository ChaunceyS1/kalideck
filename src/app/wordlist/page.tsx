import { Zap } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Wordlist Generator" };

export default function Page() {
  return (
    <ComingSoon
      title="Wordlist Generator"
      subtitle="Build targeted wordlists"
      icon={Zap}
      blurb="A builder for custom wordlists from patterns, character sets, and crawled site vocabulary, ready to feed into the password tools in the database."
      planned={["Pattern and mask based generation", "Crawl a site for a custom base list", "Export straight into the cracking tools"]}
    />
  );
}
