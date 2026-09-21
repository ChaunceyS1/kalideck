import { Shield } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Learn" };

export default function Page() {
  return (
    <ComingSoon
      title="Learn"
      subtitle="Video tutorials and guides"
      icon={Shield}
      blurb="Original written guides and curated video walkthroughs that pair with the tool database, so each command comes with the why behind it."
      planned={["Written guides tied to each tool", "Curated video walkthroughs", "Short quizzes to check understanding"]}
    />
  );
}
