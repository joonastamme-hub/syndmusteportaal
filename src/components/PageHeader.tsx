import { Link } from "react-router";

export const PageHeader = () => {
  return (
    <div className="page-header">
      <h1>Ajarada</h1>

      <p>
        Avasta minevik Rapla ümber. Ajarada toob kokku Raplamaa
        ajalooõhtud, retked, töötoad ja kohtumised.
      </p>

      <p>Korraldaja: Rapla Ajalooklubi</p>

      <nav className="site-nav" aria-label="Põhinavigatsioon">
        <Link to="/">Kava</Link>
        <Link to="/korraldajast">Korraldajast</Link>
      </nav>
    </div>
  );
};