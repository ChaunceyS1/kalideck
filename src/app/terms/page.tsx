import { DocPage } from "@/components/DocPage";

export const metadata = { title: "Terms of Service" };

export default function Page() {
  return (
    <DocPage title="Terms of Service" kicker="LEGAL">
      <section>
        <h2>1. Placeholder — Acceptable use</h2>
        <p>
          Draft the rules for lawful, authorized testing here: only systems you
          own or hold written permission to assess.
        </p>
      </section>
      <section>
        <h2>2. Placeholder — Accounts</h2>
        <p>Draft account, plan, and termination terms here.</p>
      </section>
      <section>
        <h2>3. Placeholder — Liability</h2>
        <p>Draft the disclaimer and limitation of liability here.</p>
      </section>
    </DocPage>
  );
}
