import { DocPage } from "@/components/DocPage";

export const metadata = { title: "Refund Policy" };

export default function Page() {
  return (
    <DocPage title="Refund Policy" kicker="BILLING">
      <section>
        <h2>1. Placeholder — Eligibility</h2>
        <p>Describe the refund window for paid plans here.</p>
      </section>
      <section>
        <h2>2. Placeholder — How to request</h2>
        <p>Describe the request process and expected turnaround here.</p>
      </section>
    </DocPage>
  );
}
