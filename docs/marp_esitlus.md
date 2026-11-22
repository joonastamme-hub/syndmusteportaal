---
marp: true
theme: default
paginate: true
---

# Reacti põhimõisted minu projektis

## Ajarada

**Joonas Tamme**

Ajarada on sündmuste portaal, mis koondab Raplamaa ajaloo-, kultuuri- ja pärandisündmusi.

---

## 1. Komponent

Reactis on **komponent** eraldiseisev osa kasutajaliidesest.

Komponendi mõte on jagada rakendus väiksemateks ja paremini jaotatavateks osadeks.

Näiteks kasutan oma projektis `PageHeader` komponenti:

```tsx
export const PageHeader = () => {
  return (
    <div className="page-header">
      <h1>Ajarada</h1>
      <p>Avasta minevik enda ümber.</p>
    </div>
  );
};
```

**Miks seda vaja on?**

Päise kood asub eraldi failis ning `App.tsx` jääb lihtsamaks ja loetavamaks.

---

## 2. Propsid

**Propsid** võimaldavad anda komponendile väljastpoolt väärtusi.

Minu projektis saab `Footer` komponent endale lisaks korraldaja nime:

```tsx
<Footer organization="Rapla Ajalooklubi" />
```

`Footer.tsx`:

```tsx
type FooterProps = {
  organization: string;
};

export const Footer = ({ organization }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      © {currentYear} {organization}
    </footer>
  );
};
```

**Miks seda vaja on?**

Sama komponent saab kuvada erinevaid andmeid ilma komponendi enda koodi muutmata.

---

## 3. `children`

`children` tähendab Reactis sisu, mis pannakse komponendi algus- ja lõpumärgendi vahele.
Minu projektis kasutan seda `Panel` komponendis:

```tsx
<Panel title={`Kava (${events.length} sündmust)`}>
  <div className="cards">
    {events.map((event) => (
      <EventCard key={event.id} event={event} />
    ))}
  </div>
</Panel>
```

`Panel` saab enda sisse kogu sündmuste kaartide osa.

**Miks seda vaja on?**

See võimaldab teha üldise ümbriskomponendi, mille sisse saab paigutada erinevat sisu.

---

## 4. `useState`

`useState` võimaldab Reacti komponendil väärtust meeles hoida.

Minu projektis hoiab see meeles, kas kasutusel on hele või tume teema:

```tsx
import { useState } from "react";

const [theme, setTheme] = useState("light");
```

Alguses on väärtus `"light"`.

Kui kasutaja vajutab nuppu, saab väärtuseks `"dark"`.

**Miks seda vaja on?**

Teema peab pärast nupuvajutust muutuma ning React peab uue väärtuse põhjal lehe uuesti kuvama.

---

## 5. Teemavahetaja

Teemavahetuse nupp asub eraldi `ThemeToggle` komponendis.

```tsx
type ThemeToggleProps = {
  theme: string;
  onThemeChange: (next: string) => void;
};

export const ThemeToggle = ({
  theme,
  onThemeChange,
}: ThemeToggleProps) => {
  const label =
    theme === "light"
      ? "Lülita tumedaks"
      : "Lülita heledaks";

  return (
    <button
      className="theme-button"
      onClick={() =>
        onThemeChange(
          theme === "light" ? "dark" : "light"
        )
      }
    >
      {label}
    </button>
  );
};
```

Nupu tekst sõltub praegusest `theme` väärtusest.

Eraldi olekut nupu teksti jaoks ei ole vaja.

---

## 6. Teemavahetuse andmevoog

`theme` olek asub `App` komponendis:

```tsx
const [theme, setTheme] = useState("light");
```

`ThemeToggle` saab kaks propsi:

```tsx
<ThemeToggle
  theme={theme}
  onThemeChange={setTheme}
/>
```

Lehe klass sõltub teemast:

```tsx
<div className={`app theme-${theme}`}>
```

Andmevoog on:

**nupuvajutus → ThemeToggle → setTheme → uus theme → uus CSS-klass → uued värvid**

Kui kasutaja vajutab nuppu, käivitab `ThemeToggle` funktsiooni `setTheme`. React jätab uue teema meelde ning lehe CSS-klass muutub näiteks `theme-light` väärtusest `theme-dark` väärtuseks.

---

## 7. Mida tegin iseseisvalt?

Selle projekti juures:

- muutsin näidisportaali Ajarada sündmuste portaaliks;
- lisasin enda sündmused ja nende andmed;
- kujundasin lehe ajalooportaali stiilis;
- lõin uue `Footer` komponendi;
- lisasin jalusele propsi ja jooksva aasta;
- lõin `ThemeToggle` komponendi;
- lisasin heleda ja tumeda teema.

Kõige keerulisem oli alguses mõista, kuidas `theme`, `setTheme` ja propside kaudu antav funktsioon omavahel seotud on.

Teemavahetuse tegemine aitas paremini mõista, kuidas Reacti oleku muutmine mõjutab kasutajaliidest.

---

## 8. Mida tahan veel paremini mõista?

Praegu taastub lehe värskendamisel alati hele teema, sest oleku algväärtus on:

```tsx
useState("light")
```

Tahaksin paremini mõista:

### Kuidas jätta kasutaja teemavalik meelde ka pärast lehe värskendamist?

Järgmine samm oleks salvestada valitud teema näiteks `localStorage` abil.

Siis võiks kasutaja valitud tume või hele teema säilida ka pärast brauseri sulgemist või lehe uuesti laadimist.