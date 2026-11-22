## Seminar 4 - SSG versioon

See versioon kasutab React Router Framework Mode'i ja staatilist genereerimist.

Buildi ajal küsitakse sündmused API-st ning olemasolevate sündmuste detaillehed prerenderdatakse staatilisteks HTML-failideks.

### Käivitamine arenduses

Loo projekti juurkausta `.env` fail:

```env
VITE_API_URL=https://events-api.events-portal.workers.dev

paigalda sõltuvused

käivita arendusserver 