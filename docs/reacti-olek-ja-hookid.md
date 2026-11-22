---
marp: true
theme: default
paginate: true
size: 16:9
style: |
  section {
    font-size: 24px;
  }
  pre {
    font-size: 0.7em;
    line-height: 1.3;
  }
---

# Olek ja hookid
## Ajarada - events-portal

Rapla Ajalooklubi sündmuste portaal
Teine kodutöö: filtrid, Context, effektid

---

## 1. Olek ja tuletatud väärtus

**Selgitus:** Olek (`useState`) on väärtus, mida React peab renderduste vahel meeles pidama. Tuletatud väärtus on kõik, mille saab olekust või propsidest **arvutada** - seda ei panda `useState`-isse.

```tsx
const [search, setSearch] = useState("");
// Tuletatud - arvutatakse iga renderduse ajal uuesti:
const filteredEvents = events
  .filter((e) => e.title.toLowerCase().includes(search));
```

**Levinud viga:** panna `filteredEvents` ka `useState`-isse - tekib kaks tõeallikat, mis lähevad lahku.

**Kontrollküsimus:** Kui `filteredEvents` sõltub `events`-ist ja `search`-ist, miks pole talle vaja eraldi `useState`-i?

---

## 2. Kontrollitud sisend

**Selgitus:** Kontrollitud sisend (*controlled input*) on vorminguelement, mille kuvatav väärtus tuleb täielikult Reacti olekust, mitte brauseri enda mälust. React ütleb elemendile, mida näidata; element ei "mäleta" ise midagi.

```tsx
<input
  type="search"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Otsi sündmust"
/>
```

**Levinud viga:** anda `<input>`-ile `value`, aga unustada `onChange`. Siis "kinnitab" React välja väärtuseks alati sama teksti ja kasutaja ei saagi kirjutada.

**Kontrollküsimus:** Mis vahe on `value={search}` ja `defaultValue={search}` vahel - kumb neist teeb sisendist kontrollitud elemendi?

---

## 3. Oleku tõstmine ja ühesuunaline andmevoog

**Selgitus:** Kui kaks komponenti vajavad sama olekut, tõstetakse see nende **lähimasse ühisesse vanemasse**. Andmed liiguvad alati vanemalt lapsele propsidena (alla) ja muutused liiguvad lapselt vanemale funktsioonide väljakutsumisega (üles).

```tsx
// EventPortal.tsx (vanem) hoiab olekut:
<FilterBar
  search={search}
  onSearchChange={setSearch}
  selectedTag={selectedTag}
  onTagChange={setSelectedTag}
/>
// FilterBar ei loo ise useState-i, vaid kutsub propsina
// antud funktsioone, kui kasutaja midagi muudab.
```

**Levinud viga:** luua `FilterBar`-is oma `useState(search)` - see dubleerib vanema oleku, kaks "tõde" samast väärtusest.

**Kontrollküsimus:** Miks ei tohi `FilterBar` ise hoida `search` olekut, kui ka `EventPortal` seda vajab?

---

## 4. Context vs. propside kaudu edastamine

**Selgitus:** Propsid sobivad, kui väärtust vajab otsene laps. Context sobib, kui sama väärtust vajavad mitu **omavahel mitte vanem-laps** suhtes olevat komponenti - nii ei pea vahepealsed komponendid (nt `FilterBar`) väärtust "läbi kandma", kuigi nad seda ise ei kasuta.

```tsx
const { theme, onThemeChange } = useTheme(); // ThemeToggle.tsx
const { theme } = useTheme();                // EventList.tsx
// Kaks eri komponenti, üks ühine Context — teema ei
// liigu propsina läbi header/main struktuuri.
```

**Levinud viga:** panna Contexti ka filtrite olek - `FilterBar` ja `EventPortal` on niigi vanem-laps, propsid oleksid lihtsamad.

**Kontrollküsimus:** Miks ei ole selles projektis filtrite oleku jaoks Contexti vaja, aga teema jaoks on?

---

## 5. useEffect ja sõltuvuste massiiv

**Selgitus:** `useEffect` käivitab koodi pärast renderdamist, kui on vaja suhelda millegagi väljaspool Reacti (brauseri API, `localStorage`, taimerid). Sõltuvuste massiiv `[...]` määrab, **millal** effekt uuesti käivitub.

```tsx
useEffect(() => {
  localStorage.setItem("theme", theme);
}, [theme]); // käivitub uuesti ainult siis, kui theme muutub
```

**Levinud viga:** unustada sõltuvuste massiiv täielikult ära - siis käivitub effekt pärast **igat** renderdust, isegi kui miski olulist ei muutunud.

**Kontrollküsimus:** Mis juhtuks, kui kirjutaksin `}, [])` asemel `}, [theme])` — millal effekt enam ei käivituks?

---

## 6. Cleanup (koristusfunktsioon)

**Selgitus:** Kui effekt lisab sündmusekuulaja, peab ta selle ka eemaldama - muidu kogunevad dubleerivad kuulajad. Cleanup on `useEffect`-i tagastatud funktsioon.

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onEscape();
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [onEscape]);
```

**Levinud viga:** anda `removeEventListener`-ile uus funktsioon, mitte sama viide, mis `addEventListener`-ile - siis kuulajat ei eemaldata.

**Kontrollküsimus:** Miks peab `removeEventListener`-ile andma täpselt sama funktsiooniviite?

---

## 7. localStorage ja useState-i laisk algväärtus

**Selgitus:** `useState`-ile saab algväärtuseks anda funktsiooni (mitte selle väljakutsutud tulemuse). React kutsub selle välja ainult **esimesel** renderdusel - kasulik, kui algväärtuse leidmine (nt `localStorage` lugemine) on kulukam tegevus.

```tsx
const readInitialTheme = (): Theme => {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark =
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};
const [theme, setTheme] = useState<Theme>(readInitialTheme); // ei ()!
```

**Levinud viga:** kirjutada `useState(readInitialTheme())` sulgudega - siis kutsutakse funktsioon välja igal renderdusel.

**Kontrollküsimus:** Mis vahe on `useState(readInitialTheme)` ja `useState(readInitialTheme())` vahel?

---

## 8. Custom hook

**Selgitus:** Custom hook on enda kirjutatud funktsioon, mille nimi algab sõnaga `use` ja mis kasutab enda sees teisi hooke. See peidab korduva loogika ühe lihtsa väljakutse taha.

```tsx
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme peab olema ThemeProvideri sees.");
  }
  return context;
};
```

**Levinud viga:** kutsuda hooki tingimuse (`if`) sees või pärast varajast `return`-i - hookide järjekord peab olema igal renderdusel sama.

**Kontrollküsimus:** Miks viskab `useTheme()` vea, selle asemel et lihtsalt `null` tagastada?

---

# Kokkuvõte

- **Olek** = mida React peab meeles pidama; **tuletatud** = mida saab arvutada.
- **Oleku tõstmine** hoiab andmevoo ühesuunalisena ja ühe tõeallikana.
- **Context** sobib mitme mitteseotud komponendi jaoks, mitte vanem-lapse asemel.
- **useEffect + cleanup** ühendab Reacti brauseri API-dega turvaliselt.
- **Laisk algväärtus** ja **custom hook** teevad korduva loogika lihtsaks ja korrektseks.

*Küsimused?*
