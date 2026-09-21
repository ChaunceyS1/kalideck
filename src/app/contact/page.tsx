import { DocPage } from "@/components/DocPage";

export const metadata = { title: "Contact" };

export default function Page() {
  return (
    <DocPage title="Contact" kicker="SUPPORT">
      <section>
        <h2>Placeholder — Support inbox</h2>
        <p>
          Add the real support address before launch. Until then nothing sent to
          this page reaches anyone.
        </p>
      </section>
      <section>
        <h2>Placeholder — Response times</h2>
        <p>State the expected reply window for free and paid plans.</p>
      </section>
    </DocPage>
  );
}
