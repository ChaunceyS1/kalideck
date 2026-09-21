import { DocPage } from "@/components/DocPage";

export const metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <DocPage title="Privacy Policy" kicker="LEGAL">
      <section>
        <h2>1. Placeholder — What we store</h2>
        <p>
          Describe the account email, plan, saved favorites, and chat history
          kept in the database.
        </p>
      </section>
      <section>
        <h2>2. Placeholder — Processors</h2>
        <p>List the hosting, database, and AI providers in use.</p>
      </section>
      <section>
        <h2>3. Placeholder — Deletion requests</h2>
        <p>Describe how a user asks for their data to be removed.</p>
      </section>
    </DocPage>
  );
}
