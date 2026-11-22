import { Link } from "react-router";

import { Footer } from "../../src/components/Footer";
import { PageHeader } from "../../src/components/PageHeader";
import { useTheme } from "../../src/hooks/useTheme";

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div className={`app theme-${theme}`}>
      <title>Lehte ei leitud | Ajarada</title>

      <PageHeader />

      <main>
        <h2>Lehte ei leitud</h2>

        <p>Seda Ajarada lehte ei ole olemas.</p>

        <Link to="/">Tagasi kavasse</Link>
      </main>

      <Footer organization="Rapla Ajalooklubi" />
    </div>
  );
}