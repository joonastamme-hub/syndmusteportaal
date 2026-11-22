---
marp: true
paginate: true
style: |
  section { font-size: 24px; line-height: 1.35; padding: 36px 56px; justify-content: flex-start; }
  section h1 { font-size: 34px; margin: 0 0 14px; }
  section p { margin: 0.5em 0; }
  section ul, section ol { margin: 0.3em 0; }
  section pre { display: inline-block; width: 46.5%; box-sizing: border-box; vertical-align: top; font-size: 16px; line-height: 1.3; margin: 0.4em 1%; padding: 8px 12px; }
  section blockquote { margin: 0.7em 0 0; }
---

# Andmete lugemine API-st

## Kuidas jõuab sündmus andmebaasist ekraanile?

Ajarada – Seminar 3

> **Lähteküsimus:** Kui Reactis sündmuste massiivi enam ei ole, kust rakendus need saab?

---

# 1. API, lõpp-punkt ja andmevoog

**Seos:** Kui sündmused ei ole enam Reacti failis, peab keegi neid hoidma ja keegi küsima.

**Seletus:** **API** = kokkulepe andmete küsimiseks. **Lõpp-punkt** = API aadress. **Andmevoog** = andmete tee. **JSON** = andmete tekstivorming.

```text
// Väike näide
andmebaas → /api/weather
→ JSON → veebileht
```

```ts
// src/api/events.ts
const response = await fetch(
  `${API_URL}/api/events`
);
```

**Eksimus:** „API ja andmebaas on sama asi.“

> **Kontroll:** Kus sündmused tegelikult säilivad?

<!-- Vastus: D1 andmebaasis; API ja React ei hoia neid püsivalt. Märk: kui API aadress on vale, on andmebaas terve, aga React ei saa andmeid. Teine sõnastus: raamatukogu (andmebaas), raamatukoguhoidja (API), lugeja (React). -->

---

# 2. Promise, `fetch`, `async` ja `await`

**Seos:** Vastus tuleb võrgust hiljem, aga ekraan ei tohi kinni jääda.

**Seletus:** `fetch()` annab kohe **Promise'i** („tulemus tuleb hiljem“). `await` ootab seda, aga ainult selles `async` funktsioonis.

```ts
// Väike näide
async function load() {
  console.log(1);
  await fetch("/user");
  console.log(3);
}
load();
console.log(2);
```

```ts
// src/api/events.ts
export async function fetchEvents() {
  const response = await fetch(
    `${API_URL}/api/events`
  );
  return (await response.json())
    as EventItem[];
}
```

**Eksimus:** „`await` peatab kogu programmi.“

> **Kontroll:** Mis järjekorras prinditakse 1, 2 ja 3?

<!-- Vastus: 1, 2, 3. load jääb await'i juures ootama, kutsuja läheb edasi. Teine näide: kohvi tellimine, kuni oodatakse, räägid sõbraga. -->

---

# 3. HTTP veavastus, võrguviga ja `response.ok`

**Seos:** Päring võib ebaõnnestuda kahel viisil ja kasutaja vajab õiget teadet.

**Seletus:** **HTTP viga:** server vastas koodiga 404 või 500, aga `fetch` viga ei viska. **Võrguviga:** vastust ei tulnud. `response.ok` = kood 200–299.

```ts
// Väike näide
const r = await fetch(url);
if (!r.ok) {
  throw new Error("HTTP " + r.status);
}
```

```ts
// src/api/events.ts
if (!response.ok) {
  throw new Error(
    `API vastas veaga (${response.status}).`
  );
}
```

**Eksimus:** „`fetch()` viskab 404 puhul vea.“

> **Kontroll:** Server vastab 404. Kas `fetch` viskab vea?

<!-- Vastus: ei, Promise õnnestub, aga ok on false. Ilma kontrollita loetaks vealehte andmetena ja kasutaja näeks tühja lehte. Võrguviga (vale host, katkine ühendus, CORS-blokeering) läheb catch'i. -->

---

# 4. Laadimise, vea ja valmis andmete olek

**Seos:** Andmed ei ole kohe olemas ja kasutaja peab teadma, mis toimub.

**Seletus:** Kolm olekut: **laeb**, **viga**, **valmis**. Igaühel on ekraanil oma kuva.

```tsx
// Väike näide
if (loading) return <p>Laen...</p>;
if (error) return <p>Viga!</p>;
return <List items={items} />;
```

```tsx
// EventPortal.tsx
if (eventsQuery.isPending)
  return <p>Laen...</p>;
if (eventsQuery.isError)
  return <p>Viga!</p>;
return <EventList events={eventsQuery.data} />;
```

**Eksimus:** „Tühi massiiv tähendab, et andmed on laetud.“

> **Kontroll:** Mida näeb kasutaja esimesel hetkel: „Laen...“ või „Sündmusi pole“?

<!-- Vastus: „Laen...“. Kui algväärtus on [], näeks kasutaja enne vastust „sündmusi pole“, kuigi päring alles käib. Võrdlus: tühi postkast vs. postiljon pole veel jõudnud. -->

---

# 5. `AbortController`, `AbortSignal` ja katkestamine

**Seos:** Mõnikord pole vastust enam vaja, näiteks algas uus päring.

**Seletus:** `AbortController` on pult, `abort()` on nupp. `AbortSignal` antakse `fetch`ile; nupu vajutamisel `fetch` katkeb.

```ts
// Väike näide
const c = new AbortController();
fetch("/api/events", {
  signal: c.signal,
});
c.abort();
```

```ts
// src/api/events.ts
fetch(`${API_URL}/api/events`, {
  signal,
});
```

**Eksimus:** „`AbortSignal` katkestab päringu ise.“

> **Kontroll:** Kumb kutsub välja `abort()` – controller või signal?

<!-- Vastus: controller. Ilma signal'ita fetch'ile jätkub päring. Katkestatud fetch lõpeb veaga AbortError. Võrdlus: telekapult (controller) ja telekas, mis saab signaali (signal). -->

---

# 6. Cleanup ja aegunud päringu vältimine

**Seos:** Vana aeglane vastus võib uuema üle kirjutada (race condition).

**Seletus:** **Cleanup** käivitub enne uut `useEffect`i või komponendi eemaldamist ja katkestab vana päringu.

```ts
// Väike näide
useEffect(() => {
  const c = new AbortController();
  load(c.signal);
  return () => c.abort();
}, []);
```

```ts
// src/hooks/useEvents.ts
queryFn: ({ signal }) =>
  fetchEvents(signal)
```

**Eksimus:** „Cleanup on ainult Reacti hoiatuste jaoks.“

> **Kontroll:** A algab, siis B. B saabub, A saabub hiljem. Mida näeb kasutaja ilma cleanup'ita?

<!-- Vastus: A tulemus kirjutab B üle, kasutaja näeb uue päringu kohta vana vastust. Märk: kiirel vahetusel jääb ekraanile vana tulemus. Võrdlus: kaks kullerit, aeglasem toob vana tellimuse viimasena. Portaalis annab TanStack Query queryFn'ile signal'i. -->

---

# 7. API-funktsiooni ja komponendi vastutus

**Seos:** Päring ja kuva ühes kohas on raske muuta ja korduvkasutada.

**Seletus:** **API-funktsioon** teeb päringu ja kontrollib vastust. **Komponent** otsustab, mida näidata. Ahel: `events.ts` → `useEvents.ts` → `EventPortal.tsx`.

```ts
// Väike näide
// api/users.ts
getUsers() // andmed

// Users.tsx
<Users />  // ekraan
```

```tsx
// EventPortal.tsx
// komponendis pole fetch'i
const eventsQuery = useEvents();
```

**Eksimus:** „Kogu `fetch` peab olema komponendis.“

> **Kontroll:** Millist faili muudad, kui endpoint muutub?

<!-- Vastus: src/api/events.ts, komponent jääb samaks. Märk: kui API tee muutub ja pead muutma kuvakomponenti, on vastutused segamini. Võrdlus: kokk ja ettekandja. -->

---

# 8. TanStack Query

**Seos:** Päringu olekute käsitsi kirjutamine on korduv töö.

**Seletus:** `useQuery` haldab päringut. `queryKey` = andmete nimi. `queryFn` = kuidas laadida. **Vahemälu** hoiab saadud andmeid.

```ts
// Väike näide
useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
});
```

```ts
// src/hooks/useEvents.ts
useQuery({
  queryKey: ["events"],
  queryFn: ({ signal }) =>
    fetchEvents(signal),
});
```

**Eksimus:** „TanStack Query asendab `fetch()`.“

> **Kontroll:** Mis teeb Ajaradas päris HTTP päringu?

<!-- Vastus: fetchEvents (fetch). TanStack Query lisab olekud (isPending, isError, isSuccess), vahemälu, refetch'i ja signal'i. Sama queryKey = samad andmed vahemälus; teek võib neid taustal värskendada. Võrdlus: fetch on kuller, TanStack Query on dispetšer. -->

---

# Lisa: MCP

**Seos:** AI ei tea ise, kuidas meie API-t kasutada.

**Seletus:** **MCP-server** annab AI-le tööriistad `get-events` ja `search-events`. Ta küsib andmed samast API-st ja on ainult lugemiseks.

**Eksimus:** „Ainult lugemine tähendab täielikku turvalisust.“

> **Kontroll:** Miks kasutab React API-t otse, aga AI MCP-serverit?

<!-- Vastus: React teab oma andmevoogu ja kasutab fetch'i. MCP kirjeldab AI-le, millised tööriistad on olemas; AI-klient käivitab MCP-serveri ise. Turvalisus: API on avalik ja AI loeb sündmuste tekste, mis võivad sisaldada eksitavaid juhiseid. -->

---

# Kogu andmevoog

1. **D1** → **Worker API** → `/api/events` (1)
2. `fetchEvents()`: `fetch` + `await` (2)
3. `response.ok` kontrollib HTTP viga (3)
4. `useQuery` haldab päringut (8), `signal` katkestab vana (5, 6)
5. `isPending` / `isError` / `isSuccess` (4)
6. `EventPortal` kuvab tulemuse (7)

> **Lõpuküsimus:** Mis etapis märkame, et API vastas 404?

<!-- Vastus: 3. etapis, response.ok kontrollis. -->