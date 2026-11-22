# Seminar 3 analüüs

## Andmevoog

```text
D1 andmebaas → Worker API → Reacti portaal → inimene
                         ↘ MCP-server → AI klient → AI vastus
```

### 1. Milline osa hoiab sündmuste algandmeid ja millised osad neid ainult küsivad?

Sündmuste algandmeid hoiab Cloudflare D1 andmebaas. Worker API loeb sündmused D1-st ja muudab need HTTP API kaudu kättesaadavaks.

Reacti portaal küsib sündmused Worker API-st ning kuvab need kasutajale. MCP-server küsib samuti sündmused samast API-st ja pakub AI-kliendile nende kasutamiseks eraldi tööriistu. React ega MCP-server ei ole seega sündmuste algandmete püsiv hoiukoht.

### 2. Miks kasutab React API-t otse, aga AI-klient MCP-serverit?

Reacti portaalil on ette määratud kasutajaliides ja kindel andmevoog, seega saab ta sündmuste API-t otse `fetch`-päringuga kasutada.

AI-klient kasutab MCP-serverit, sest MCP kirjeldab AI-le, millised tööriistad on saadaval ja kuidas neid kasutada. Näiteks `search-events` võtab vastu otsingusõna või fraasi ning otsib seda sündmuste pealkirjast, kirjeldusest, asukohast ja siltidest.

`search-events` ise ei mõista kasutaja loomulikku keelt. AI tõlgendab kasutaja küsimuse ning otsustab, milline otsingusõna või fraas tööriistale anda.

---

# Samm 1 – API repo loomine

**Eesmärk:**
Luua Reacti rakendusest eraldi API projekt, mis hakkab sündmuste andmeid väljastama.

**Muudatus:**
Lõin õppejõu API mallist enda `events-api` GitHubi repo, kloonisin selle arvutisse ja paigaldasin projekti sõltuvused käsuga:

```bash
npm install
```

**Kontroll:**
Kontrollisin Wrangleri olemasolu:

```bash
npx wrangler --version
```

Samuti kontrollisin, et projektis oleksid olemas vajalikud failid, näiteks `package.json`, `wrangler.jsonc`, `src/index.ts` ja migratsioonide kaust.

**Selgitus:**
API projekt vastutab sündmuste väljastamise eest. Reacti portaal ei pea pärast API-ga ühendamist sündmuste algandmeid enam enda `src/data/events.ts` failis hoidma.

---

# Samm 2 – näidisandmete asendamine

**Eesmärk:**
Asendada õppejõu API näidissündmused enda Ajarada portaali sündmustega.

**Muudatus:**
Muutsin `migrations/0001_create_events.sql` faili ning asendasin õpetaja näidisandmed enda Raplamaa ajaloo- ja kultuurisündmustega.

`0001_create_events.sql` muudatus tehti enne seda, kui minu muudetud versioon kohalikku andmebaasi rakendati.

Kaugandmebaasi puhul selgus aga hiljem, et `0001` migratsiooni vana versioon oli juba rakendatud. Seetõttu ei rakendanud Wrangler sama migratsiooni teist korda ning kaug-API näitas jätkuvalt õppejõu näidisandmeid.

Selle parandamiseks tegin uue migratsiooni:

```text
0002_replace_events.sql
```

See kustutas vanad sündmused ja lisas minu Ajarada sündmused.

Hiljem lisasin veel migratsiooni:

```text
0003_add_more_events.sql
```

et suurendada sündmuste arvu vähemalt paarikümneni.

**Kontroll:**
Kontrollisin SQL-faile ning pärast migratsioonide rakendamist API `/api/events` vastust. Seal olid minu enda sündmuste pealkirjad, kirjeldused, kuupäevad, asukohad ja sildid.

**Selgitus:**
Juba rakendatud migratsiooni muutmine ei tähenda, et andmebaas seda automaatselt uuesti käivitaks. Seetõttu tuleb juba kasutusel oleva andmebaasi järgmised muudatused teha uue migratsioonifailiga.

---

# Samm 3 – piltide lisamine

**Eesmärk:**
Võimaldada sündmustel kasutada pilte, mida Reacti portaal saab API kaudu kuvada.

**Muudatus:**
Lisasin pildifaili API projekti:

```text
public/images/
```

SQL-is salvestasin pildi tee suhtelisel kujul, näiteks:

```text
/images/retk.png
```

**Kontroll:**
Kontrollisin API JSON-vastuses pildiga sündmuse `imageUrl` väärtust ja avasin selle aadressi eraldi brauserivahelehel.

SQL-is on pildi tee suhteline, kuid API vastuses peab React saama kasutatava pildiaadressi. Minu juurutatud API tagastas pildi Workeri aadressiga, mitte Reacti portaali enda suhtelise teena.

**Selgitus:**
Reacti portaal ja Worker töötavad erinevatel aadressidel ehk erinevatel origin'itel. Kui React saaks ainult väärtuse `/images/retk.png`, prooviks brauser seda vaikimisi Reacti rakenduse origin'ilt laadida. Seetõttu peab API vastuses olev `imageUrl` osutama tegelikule Workeri pildiaadressile.

---

# Samm 4 – API kohalik käivitamine

**Eesmärk:**
Kontrollida API ja D1 andmebaasi tööd enne internetti juurutamist.

**Muudatus:**
Rakendasin kohaliku andmebaasi migratsioonid:

```bash
npm run db:local
```

Seejärel käivitasin API:

```bash
npm run dev
```

**Kontroll:**
Avasin:

```text
http://localhost:8787/api/events
```

ja sain JSON-massiivi sündmustega.

Kui avasin ainult:

```text
http://localhost:8787/
```

sain 404 ehk „Tundmatu lõpp-punkt”, sest sündmuste endpoint asub `/api/events` teel.

**Selgitus:**
Kohalik käivitamine võimaldas kontrollida Workeri ja andmebaasi koostööd enne Cloudflare'i juurutamist.

---

# Samm 5 – Cloudflare D1 andmebaasi loomine

**Eesmärk:**
Luua sündmuste jaoks pilves asuv D1 andmebaas.

**Muudatus:**
Logisin Wrangleriga Cloudflare'i:

```bash
npx wrangler login
```

Kontrollisin kontot:

```bash
npx wrangler whoami
```

ja lõin D1 andmebaasi:

```bash
npx wrangler d1 create events-db
```

Seejärel lisasin saadud `database_id` väärtuse `wrangler.jsonc` faili.

**Kontroll:**
`whoami` kinnitas ainult seda, millise Cloudflare'i kontoga olin sisse logitud.

Andmebaasi olemasolu tõendas täpsemalt `wrangler d1 create events-db` edukas väljund koos `database_id` väärtusega. Hiljem kinnitas ühendust veel see, et:

```bash
npm run db:remote
```

suutis migratsioonid D1 andmebaasile rakendada.

**Selgitus:**
Worker kasutab D1 sidumist nimega `DB`. Vale `database_id` või vale binding'u nimi takistaks Workeril andmebaasiga suhtlemist.

---

# Samm 6 – API juurutamine

**Eesmärk:**
Teha API ja selle staatilised pildid internetist kättesaadavaks.

**Muudatus:**
Rakendasin kaugandmebaasi migratsioonid:

```bash
npm run db:remote
```

Seejärel juurutasin Workeri:

```bash
npm run deploy
```

Esimesel juurutamisel registreerisin ka `workers.dev` alamdomeeni.

**Kontroll:**
Avasin juurutatud Workeri aadressi koos:

```text
/api/events
```

lõpuga ning kontrollisin, et vastuseks tuleksid minu sündmused.

Kontrollisin ka vähemalt ühe `imageUrl` aadressi brauseris.

**Selgitus:**
`db:remote` muudab D1 andmebaasi. `deploy` avaldab Workeri koodi ja staatilised failid. Need on kaks erinevat tegevust.

---

# Samm 7 – API vastuse kontroll

**Eesmärk:**
Veenduda enne Reacti muutmist, et API tagastab sobiva kujuga andmed.

**Muudatus:**
Selles sammus koodi ei muutnud.

**Kontroll:**
Kontrollisin juurutatud `/api/events` vastust. Sündmustel olid vajalikud väljad:

* `id`
* `title`
* `description`
* `startsAt`
* `location`
* `tags`

Pildiga sündmusel oli lisaks `imageUrl`.

**Selgitus:**
Kui API ise ei tagasta õigeid andmeid, ei ole mõistlik hakata Reacti poolel sama probleemi otsima.

---

# Samm 8 – API aadress keskkonnamuutujasse

**Eesmärk:**
Hoida API põhiaadress Reacti komponentidest eraldi.

**Muudatus:**
Lõin Reacti projekti juurkausta `.env` faili ja lisasin sinna muutuja:

```text
VITE_API_URL
```

Päris `.env` faili GitHubi ei lisata.

**Kontroll:**
Taaskäivitasin Vite arendusserveri:

```bash
npm run dev
```

ja kontrollisin, et React sai API-st sündmused kätte.

Teises arvutis tuli `.env` fail uuesti käsitsi luua, sest seda ei olnud GitHubist kloonitud.

**Selgitus:**
Vite loeb `VITE_` algusega keskkonnamuutujad käivitamisel.

React ja Worker töötavad erinevatel origin'itel, mistõttu peab Worker lubama sobiva CORS-päringu. Kuna minu brauseris töötas Reacti portaalist Workeri API poole tehtud päring, oli vajalik cross-origin ligipääs olemas.

Kui CORS blokeeriks päringu, näeks JavaScript seda `fetch` tasemel ebaõnnestunud ühendusena ning see jõuaks minu ühenduse vea käsitlusse.

---

# Samm 9 – `imageUrl` lisamine sündmuse tüüpi

**Eesmärk:**
Kirjeldada TypeScriptile, et sündmusel võib olla pilt.

**Muudatus:**
Lisasin `EventItem` tüüpi:

```ts
imageUrl?: string;
```

**Kontroll:**
Projekt kompileerus ning nii pildiga kui ka pildita sündmused kuvati.

**Selgitus:**
Küsimärk tähendab, et omadus on valikuline. Kõigil API sündmustel ei pea `imageUrl` välja olema.

---

# Samm 10 – API päringu funktsioon

**Eesmärk:**
Hoida võrgupäringu loogika kuvakomponentidest eraldi.

**Muudatus:**
Lõin faili:

```text
src/api/events.ts
```

Seal loetakse `VITE_API_URL`, tehakse `fetch` päring, kontrollitakse `response.ok` ja käsitletakse ühenduse viga.

**Kontroll:**
Kontrollisin töötava API-ga, et sündmused saabuvad Reacti. Hiljem testisin eraldi ka HTTP viga ja mittetöötavat hosti.

**Selgitus:**
`fetch` ei muutu automaatselt rejected Promise'iks lihtsalt sellepärast, et server vastab näiteks 404 või 500 staatusega. Seetõttu tuleb HTTP viga kontrollida `response.ok` abil.

Kui päring ei jõua serverini üldse, näiteks vale hosti, võrgu- või CORS-probleemi tõttu, läheb `fetch` `catch` harusse.

---

# Samm 11 – laadimise, vea ja andmete kuvamine

**Eesmärk:**
Näidata kasutajale API päringu tegelikku olekut.

**Muudatus:**
Esimeses lahenduses lisasin `EventPortal` komponendile:

* `events`
* `isLoading`
* `error`
* `reload`

state'id ning `useEffect` päringu tegemiseks.

Kasutasin ka `AbortController`-it.

**Kontroll:**
Töötava API puhul kuvati sündmused. Vigase API aadressi korral kuvati veateade ja nupp „Proovi uuesti”.

**Selgitus:**
`AbortController` aitab katkestada päringu, mida enam vaja ei ole.

Oluline põhjus on vältida võidujooksu olukorda: kui käivitub uus päring, ei tohiks vana aeglasem vastus hiljem saabudes kirjutada uuema päringu tulemust üle.

---

# Samm 12 – API pildi kuvamine EventCardis

**Eesmärk:**
Kuvada API-st tulev pilt sündmuse kaardil.

**Muudatus:**
Lisasin `EventCard.tsx` faili tingimusliku pildi:

```tsx
{event.imageUrl && (
  <img
    className="event-card__image"
    src={event.imageUrl}
    alt={`Sündmuse „${event.title}” foto`}
    loading="lazy"
  />
)}
```

Kohandasin ka `.event-card__image` CSS-i.

**Kontroll:**
Pildiga sündmusel kuvati foto. Pildita sündmusel ei tekkinud katkist `<img>` elementi.

**Selgitus:**
`event.imageUrl && (...)` tähendab, et `<img>` renderdatakse ainult siis, kui `imageUrl` on olemas.

---

# Samm 13 – TanStack Query

**Eesmärk:**
Viia serveriandmete päringu oleku haldamine spetsiaalse teegi peale.

**Muudatus:**
Paigaldasin:

```bash
npm install @tanstack/react-query
```

Lõin:

```text
src/hooks/useEvents.ts
```

ja lisasin `QueryClientProvider`-i rakenduse ümber.

Eemaldasin `EventPortal` komponendist käsitsi kirjutatud API päringu `useEffect`-i ja selle päringuga seotud state'id.

**Kontroll:**
Kontrollisin:

* `isPending`
* `isError`
* `isSuccess`
* `refetch()`

käitumist.

**Selgitus:**
TanStack Query ei asenda `fetch`-i. `fetchEvents()` teeb endiselt HTTP päringu.

TanStack Query haldab serveriandmete päringu olekut ja vahemälu. Otsingutekst, valitud sildid ning „Ainult tulevased” on kasutajaliidese olekud ja jäävad Reacti enda state'ideks. Need funktsioonid olid portaalis olemas juba Seminar 2 lähtepunktis, mitte ei loodud alles TanStack Query sammus.

---

# Samm 14 – päringu kontroll kolmes olukorras

**Eesmärk:**
Kontrollida eraldi edukat API päringut, HTTP veavastust ja olukorda, kus API-ni ei jõuta.

**Muudatus:**
Püsivat muudatust ei teinud. Testide jaoks muutsin ajutiselt endpointi ja `.env` väärtust.

**Kontroll:**

### Töötav API

Õige API aadressiga kuvati sündmused.

### HTTP viga

Muutsin ajutiselt:

```text
/api/events
```

kujule:

```text
/api/missing
```

ja rakendus näitas HTTP 404 viga.

### API pole kättesaadav

Panin `.env` faili ajutiselt mittetöötava hosti ning rakendus näitas ühenduse veateadet.

Pärast teste taastasin õiged väärtused.

**Selgitus:**
HTTP vea puhul jõuab päring serverini ja server vastab HTTP veakoodiga.

Ühenduse vea puhul ei saada kasutatavat HTTP vastust. Selle põhjuseks võib olla näiteks vale host, katkine võrk või brauseri poolt blokeeritud CORS-päring.

Seetõttu ei saa ainult kasutajaliideses nähtava „ühenduse vea” põhjal alati öelda, kas füüsiline internetiühendus puudus või brauser blokeeris päringu mõnel muul võrgutaseme põhjusel.

---

# Lisaülesanne A – teema refaktor

**Eesmärk:**
Eemaldada `react/only-export-components` lint hoiatus ja jagada teema loogika eri vastutustega failidesse.

**Muudatus:**
Jagasin lahenduse kolmeks:

```text
src/context/ThemeContext.ts
src/context/ThemeProvider.tsx
src/hooks/useTheme.ts
```

Refaktori käigus tekkisid alguses TypeScripti vead, sest vanad `Theme` ja `ThemeContext` deklaratsioonid jäid `ThemeProvider.tsx` faili alles ning `ThemeToggle.tsx` failis puudus `Theme` tüübi import.

Parandasin need konfliktid.

**Kontroll:**
Käivitasin:

```bash
npm run lint
npm run build
```

Pärast parandusi läbis projekt kontrollid.

**Selgitus:**
`ThemeContext.ts` sisaldab Contexti ja tüüpe, `ThemeProvider.tsx` Provideri komponenti ning `useTheme.ts` hooki.

---

# Vaheharjutus – mitme sildi valik

**Eesmärk:**
Lubada kasutajal valida korraga mitu sündmuse silti.

**Muudatus:**
Asendasin ühe väärtuse:

```text
selectedTag
```

massiiviga:

```text
selectedTags
```

Lisasin `toggleTag` funktsiooni ning muutsin `FilterBar` komponenti.

**Kontroll:**
Valisin kaks silti korraga ja kontrollisin, et mõlemad jäid aktiivseks. Seejärel eemaldasin ühe valiku ja kasutasin nuppu „Kõik”.

Kontrollisin ka `Escape`-klahvi. Kuna `clearFilters` tühjendab lisaks siltidele ka otsingu ja taastab „Ainult tulevased” algväärtuse, kontrollisin, et need filtrid töötaksid jätkuvalt koos sildifiltriga.

**Selgitus:**
Kui valitud siltide massiiv on tühi, ei piira sildifilter tulemusi.

Kui silte on valitud, kasutatakse `some()` kontrolli ning sündmus jääb tulemusse siis, kui vähemalt üks valitud silt kuulub sündmuse siltide hulka.

---

# Samm 15 – Node.js versiooni kontroll

**Eesmärk:**
Veenduda, et kasutatav Node.js versioon sobib MCP osa tööriistadega.

**Muudatus:**
Koodi ei muutnud.

**Kontroll:**
Käivitasin:

```bash
node --version
```

ja sain:

```text
v24.13.0
```

Juhendis nõutud MCP osa minimaalne versioon oli Node.js `v22.19.0` või uuem, seega minu versioon vastas nõudele.

**Selgitus:**
Liiga vana Node.js versioon võib takistada MCP SDK või Inspectori kasutamist.

---

# Samm 16 – MCP alamprojekti loomine

**Eesmärk:**
Luua Reacti rakendusest eraldi Node.js programm, mille kaudu AI saab kasutada sama sündmuste API-t.

**Muudatus:**
Lõin:

```text
mcp-server/
```

alamprojekti.

Paigaldasin MCP, Zodi, `tsx`, TypeScripti ja Node.js tüübid ning lisasin `tsconfig.json` faili.

`package.json` sai muu hulgas skriptid:

```text
start
typecheck
```

**Kontroll:**
Kontrollisin projekti struktuuri ja sõltuvuste paigaldamist.

Hiljem kasutasin käivitamiseks edukalt `npm run start` skripti. Enne lõplikku esitamist tuleb MCP-serveri juures käivitada ka:

```bash
npm run typecheck
```

Kui seda kontrolli ei ole veel pärast viimaseid muudatusi tehtud, ei tohi analüüsis väita, et tüübikontroll on juba edukalt läbitud.

**Selgitus:**
MCP-server on Reacti rakendusest eraldi programm. React kasutab API-t brauserist, MCP-server kasutab sama API-t Node.js keskkonnast.

---

# Samm 17 – MCP API aadress

**Eesmärk:**
Anda MCP-serverile teada, millist sündmuste API endpointi kasutada.

**Muudatus:**
Lõin:

```text
mcp-server/.env
```

faili ja määrasin seal:

```text
EVENTS_API_URL
```

MCP puhul sisaldab see täielikku `/api/events` aadressi.

**Kontroll:**
Avasin sama endpointi brauseris ja kontrollisin, et see tagastab minu sündmuste JSON-i.

**Selgitus:**
`.env` faili olemasolu üksi ei tähenda, et Node.js programmi muutujad automaatselt `process.env` objekti jõuavad.

Minu `mcp-server/src/index.ts` kasutab selleks Node.js funktsiooni:

```ts
loadEnvFile();
```

mis loeb `.env` faili väärtused `process.env` objekti.

Seejärel saab kood kasutada:

```ts
process.env.EVENTS_API_URL
```

väärtust.

---

# Samm 18 – esimene MCP tööriist

**Eesmärk:**
Kontrollida kõigepealt võimalikult lihtsa tööriistaga, et MCP server ja Inspector saavad omavahel suhelda.

**Muudatus:**
Lõin:

```text
mcp-server/src/mini-server.ts
```

ja lisasin tööriista:

```text
say-hello
```

**Kontroll:**
Käivitasin MCP Inspectori ning `say-hello` andis vastuseks:

```text
Tere!
```

**Selgitus:**
See tõendas, et lihtne MCP stdio-server sai käivituda ja Inspector suutis selle tööriista kasutada.

See ei tõendanud veel sündmuste API ühendust ega `get-events` / `search-events` tööriistu.

---

# Samm 19 – päris MCP sündmuste serveri ettevalmistamine

**Eesmärk:**
Asendada testserver päris sündmuste API-d kasutava MCP-serveriga.

**Muudatus:**
Juhendi järgi oleksin pidanud selles sammus looma või kopeerima:

```text
mcp-server/src/index.ts
```

ning lisama sinna `get-events` ja `search-events` tööriistad.

Tegelikult jäi `index.ts` selles etapis loomata.

**Kontroll:**
Päris sündmuste serverit ei saanud selles sammus edukalt kontrollida.

Sammus 18 kontrollitud `mini-server.ts` töötas, kuid see ei olnud sama server ega sisaldanud sündmuste tööriistu.

**Selgitus:**
See oli minu töövoos tegemata jäänud samm. Puuduv fail tuli välja alles järgmises etapis Codexiga MCP ühendust proovides.

---

# Samm 20 – AI-kliendi ühendamine ja puuduva `index.ts` leidmine

**Eesmärk:**
Kontrollida, kas AI-klient suudab MCP-serveri kaudu minu sündmuste API-d kasutada.

**Muudatus:**
Paigaldasin Codex CLI.

Alguses proovis Codex kasutada mudelit, mida minu ChatGPT kontoga Codexis kasutada ei saanud. Käivitasin seejärel Codexi toetatud Astra mudeliga.

Lisasin MCP-serveri Codexi konfiguratsiooni:

```bash
codex mcp add events -- npm --prefix ".../mcp-server" --silent run start
```

Kontroll:

```bash
codex mcp list
```

näitas:

```text
events ... enabled
```

Esimesel MCP päringul vastas Codex siiski, et `search-events` tööriist ei ole sessioonis saadaval.

Seetõttu käivitasin sama MCP käivituskäsu käsitsi:

```bash
npm --prefix "$PWD/mcp-server" --silent run start
```

Sain vea:

```text
ERR_MODULE_NOT_FOUND
Cannot find module .../mcp-server/src/index.ts
```

Sellest selgus, et Sammus 19 oli `index.ts` loomata jäänud.

Alles seejärel lõin:

```text
mcp-server/src/index.ts
```

ja lisasin sinna:

* API päringu;
* `get-events`;
* `search-events`.

**Kontroll:**
Pärast parandust käivitasin Codexi uue sessiooni ning palusin tal kasutada konkreetselt `events` MCP-serveri `search-events` tööriista Rapla sündmuste otsimiseks.

Tööriist töötas ja tagastas neli Rapla sündmust.

Kontrollisin tööriistakasutuse jäljest, et kasutati MCP `search-events` tööriista, mitte projektifailide või terminaliotsingut.

**Selgitus:**
`codex mcp list` olek `enabled` tõendab, et MCP-serveri konfiguratsioon on Codexis olemas ja lubatud. See ei tõenda, et käivituskäsk päriselt õnnestub või et server registreerib vajalikud tööriistad.

Käsitsi `npm run start` käivitamine andis täpse vea ja võimaldas puuduva `index.ts` faili kiiresti leida.

---

# Kokkuvõtvad küsimused

## 1. Mis vahe on võrguveal ja HTTP veavastusel?

HTTP veavastuse korral jõuab päring serverini ning server saadab HTTP vastuse, kuid selle staatus ei ole edukas. Näiteks võib vastus olla:

```text
404 Not Found
```

või:

```text
500 Internal Server Error
```

`fetch` ei käsitle neid automaatselt võrguveana, mistõttu kontrollin neid `response.ok` abil.

Võrguvea puhul ei saa `fetch` kasutatavat HTTP vastust. Põhjuseks võib olla näiteks vale host, ühenduse puudumine või brauseri CORS-blokeering.

Seega tähendab minu rakenduse „API-ga ei saanud ühendust” teade laiemalt seda, et `fetch` ei saanud kasutatavat vastust. See ei tõesta üksi, et füüsiline internetiühendus oli katkenud.

---

## 2. Miks ei piisa sellest, et TypeScriptis kirjutad API vastuse tüübiks `EventItem[]`?

Koodis kasutatud:

```ts
(await response.json()) as EventItem[]
```

on TypeScripti tüübi väide ehk type assertion.

See ei kontrolli API vastust. Vastupidi, sellega ütlen kompilaatorile, et ta käsitleks saadud väärtust `EventItem[]` kujul ja usaldaks minu väidet.

TypeScripti tüübid eemaldatakse JavaScriptiks kompileerimisel ning runtime'is ei kontrollita nende abil JSON-i välju ega väärtuste tüüpe.

Kui API tagastaks vale kujuga andmed, võib programm seetõttu ikkagi runtime'is vea saada.

Päris runtime-valideerimiseks oleks vaja saadud JSON eraldi kontrollida, näiteks Zodi skeemiga.

---

## 3. Mille poolest erinevad TanStack Query päringuolekud filtrite olekust?

TanStack Query haldab serveriandmetega seotud olekut. Näiteks:

* `isPending` – esimest vastust veel oodatakse;
* `isError` – päring lõppes veaga;
* `isSuccess` – päring õnnestus;
* `data` – serverist saadud sündmused.

Filtrite state'id kirjeldavad aga kasutaja valikuid:

* otsingutekst;
* valitud sildid;
* „Ainult tulevased”.

Need funktsioonid olid minu Seminar 2 portaali lähtefunktsionaalsuse osa ja jäid Reacti state'ideks ka pärast TanStack Query lisamist.

TanStack Query ei pea teadma, millise sildi kasutaja kasutajaliideses valis.

---

## 4. Mida saavad `get-events` ja `search-events` teha ning mida minu server neile ei võimalda?

`get-events` loeb sündmuste API-st kõik sündmused.

`search-events` loeb sündmused API-st ja otsib kasutaja sisestatud märksõna või fraasi:

* pealkirjast;
* kirjeldusest;
* asukohast;
* siltidest.

MCP-serveril puudub D1 andmebaasi otseühendus ning minu kasutatav API/MCP lahendus ei paku nendele tööriistadele sündmuste lisamise, muutmise ega kustutamise operatsioone.

Seetõttu on tööriistad praeguses lahenduses ainult lugemiseks.

See ei tähenda, et süsteem oleks automaatselt täielikult turvaline. API on internetist kättesaadav ja AI töötleb API-st tulevat teksti. Näiteks sündmuste kirjeldused võivad teoreetiliselt sisaldada AI jaoks eksitavaid või juhistena näivaid tekste. Seetõttu ei tohiks ainult lugemisõigust võrdsustada täieliku turvalisusega.

---

## 5. Kuidas kontrollisin, et AI vastus pärines MCP tööriista kaudu minu API-st?

Lisasin `events` MCP-serveri Codex CLI konfiguratsiooni.

Esimesel katsel MCP tööriist ei olnud kättesaadav. Käsitsi serverit käivitades avastasin, et `src/index.ts` puudus.

Pärast `index.ts` loomist ja `get-events` ning `search-events` tööriistade lisamist käivitasin Codexi uue sessiooni.

Andsin talle otsese juhise kasutada:

```text
events/search-events
```

tööriista Rapla sündmuste otsimiseks ning keelasin projektifailide ja terminaliotsingu kasutamise.

Tööriist tagastas neli Rapla sündmust. Kontrollisin Codexi tööriistakasutuse jälge ja nägin, et kasutati MCP `search-events` tööriista.

See on tugevam kontroll kui ainult õige vastuse saamine, sest sama vastuse oleks AI võinud muidu leida näiteks projektifailidest.
