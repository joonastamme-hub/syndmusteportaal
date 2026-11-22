# Seminar 4 refleksioon

## Tööaeg

Alustasin Seminar 4 kodutööga. Töö eesmärk on võrrelda sama sündmuste portaali CSR-, SSG- ja SSR-versiooni.

## CSR


Lõin Seminari 3 sündmuste portaalist eraldi CSR-töökoopia ja lisasin React Routeri deklaratiivse marsruutimise. Rakenduses on avaleht `/`, sündmuse detailvaade `/sundmused/:id`, korraldajast-leht `/korraldajast` ja tundmatu tee käsitlus.

Sündmuse detailvaates loetakse ID URL-ist. Enne API päringut kontrollin, et ID oleks positiivne täisarv. Ühe sündmuse andmete küsimiseks lisasin `src/api/events.ts` faili funktsiooni `fetchEvent` ja `src/hooks/useEvent.ts` faili TanStack Query hooki `useEvent`.

Kontrollisin olemasolevat sündmust ID-ga 4 aadressil:

`http://localhost:5173/sundmused/4`

Detailvaates kuvati õige sündmus.

Puuduvat sündmust kontrollisin ID-ga 999. API tagastas selle ID puhul 404 ning rakendus kuvas teate „Sündmust ei leitud“.

Kontrollisin ka vigast ID-d:

`http://localhost:5173/sundmused/asd`

Rakendus kuvas teate „Vigane sündmuse ID“ ja sellise ID-ga API päringut ei olnud vaja teha.

Tundmatut teed kontrollisin aadressil:

`http://localhost:5173/midagi`

Rakendus kuvas „Lehte ei leitud“.

Kontrollisin detailmarsruudi otsest avamist, lehe värskendamist ning brauseri tagasi- ja edasinavigeerimist. Need töötasid arendusserveris.

Käivitasin:

`npm run lint`

ja

`npm run build`

Mõlemad läbisid veata.

Kontrollisin faili `dist/index.html`. Konkreetse sündmuse sisu seal ei olnud. See aitas mul aru saada, et CSR-is ei looda sündmuse HTML-i buildi ajal. Brauser saab algse HTML-i ja JavaScript küsib sündmuse andmed API-st alles pärast rakenduse käivitumist.

CSR-i puhul sai mulle selgemaks, et URL võib küll otse detailvaatele osutada, kuid sündmuse andmed ja tegelik vaade valmivad kliendi brauseris pärast JavaScripti käivitumist.

## SSG

SSG-versiooni jaoks viisin sündmuste portaali React Router Framework Mode'i. Marsruudid on kirjeldatud failis `app/routes.ts` ning avalehe ja sündmuse detailvaate andmed laaditakse route loaderite kaudu.

SSG-versioonis ei kasuta ma sama marsruudiandmete laadimiseks TanStack Queryt. Avalehe loader kasutab `fetchEvents` funktsiooni ning sündmuse detaillehe loader kasutab `fetchEvent` funktsiooni.

Failis `react-router.config.ts` määrasin `ssr: false` ja `prerender()` funktsiooni. `prerender()` küsib buildi ajal API-st olemasolevad sündmused ning loob nende ID-de põhjal detailmarsruudid.

Kontrollisin buildi käsuga:

`npm run build`

Build läbis edukalt ja `build/client` kausta tekkisid avalehe, korraldajast-lehe ja sündmuste detaillehtede staatilised HTML-failid.

Olemasoleva sündmuse ID oli 4.



Staatilise buildi kontrollimiseks käivitasin Cloudflare Workeri käsuga:

`npx wrangler@latest dev --assets=./build/client`

Olemasoleva sündmuse aadress:

`http://localhost:8787/sundmused/[OLEMASOLEV ID]`

tagastas HTTP staatuse **200** ja kuvas õige sündmuse.

Puuduvaks sündmuseks kasutasin ID-d **999**. Kontrollisin eelnevalt, et see ID puudub API-st.

Aadress:

`http://localhost:8787/sundmused/999`

tagastas staatilise Workeri kaudu HTTP staatuse **404**.

Kontrollisin ka tundmatut teed:

`http://localhost:8787/midagi`

See tagastas HTTP staatuse **404**.

Kontrollisin API tõrke mõju buildile, määrates ajutiselt vale API aadressi. Uus SSG build ebaõnnestus, sest prerenderdamiseks vajalikke sündmuste andmeid ei olnud võimalik API-st laadida. Pärast õige API aadressi taastamist läbis build uuesti edukalt.

SSG puhul sai mulle selgemaks, et sündmuse andmed küsitakse API-st buildi ajal. Selle tulemusena on sündmuse sisu valmis HTML-failis juba enne seda, kui kasutaja lehe avab.

## SSR

Täidan selle osa pärast SSR-versiooni loomist ja kontrollimist.

## CSR, SSG ja SSR võrdlus

Täidan pärast kolme versiooni kontrollimist.

## Nõuded ja AI kasutamine

Täidan töö käigus.

## Lõpuküsimused

Täidan töö lõpus.

## Lisaküsimused

Täidan töö lõpus.




## Seminar 4 - CSR versioon

See versioon kasutab React Routeri deklaratiivset marsruutimist ja laadib sündmuse detailandmed brauseris API-st.

Marsruudid:

- `/` - sündmuste kava
- `/sundmused/:id` - sündmuse detailvaade
- `/korraldajast` - info korraldaja kohta
- tundmatu tee - „Lehte ei leitud”

### Käivitamine

Loo projekti juurkausta `.env` fail:

```env
VITE_API_URL=<oma API põhiaadress>