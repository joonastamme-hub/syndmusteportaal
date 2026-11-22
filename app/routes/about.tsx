import { Link } from "react-router";

import { Footer } from "../../src/components/Footer";
import { PageHeader } from "../../src/components/PageHeader";
import { useTheme } from "../../src/hooks/useTheme";

export default function About() {
  const { theme } = useTheme();

  return (
    <div className={`app theme-${theme}`}>
      <title>Korraldajast | Ajarada</title>

      <PageHeader />

      <main>
        <section className="panel">
          <h2>Rapla Ajalooklubi</h2>

          <p>
            Rapla Ajalooklubi korraldab ajaloo-, kultuuri- ja
            koduloosündmusi, mis aitavad avastada Raplamaa minevikku.
          </p>

          <p>
            <Link to="/">Tagasi kavasse</Link>
          </p>
        </section>
      </main>

      <Footer organization="Rapla Ajalooklubi" />
    </div>
  );
}