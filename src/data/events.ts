import type { EventItem } from "../types/event";

export const events: EventItem[] = [
  {
    id: 1,
    title: "Mõisate saladused",
    description:
      "Giidiga retk, kus tutvume Raplamaa mõisakultuuri, mõisnike elu ja vanade hoonetega seotud lugudega.",
    startsAt: "2026-09-19T12:00",
    location: "Alu mõis, Raplamaa",
    tags: ["retk", "mõisad", "ajalugu"],
  },
  {
    id: 2,
    title: "Öine ajaloorännak Raplas",
    description:
      "Õhtune jalutuskäik läbi Rapla, kus avastame vanu hooneid, kadunud paiku ja kohaliku ajalooga seotud legende.",
    startsAt: "2026-09-26T20:00",
    location: "Rapla keskväljak",
    tags: ["ekskursioon", "kodulugu", "ajalugu"],
    imageUrl: "/images/retk.png",
  },
  {
    id: 3,
    title: "Oma suguvõsa jälgedel",
    description:
      "Praktiline töötuba algajatele, kus õpime koostama sugupuud ning otsima esivanemate kohta teavet arhiiviallikatest.",
    startsAt: "2026-10-10T11:00",
    location: "Rapla Kultuurikeskus",
    tags: ["töötuba", "genealoogia", "arhiiv"],
  },
  {
    id: 4,
    title: "Eesti elu 1990ndatel",
    description:
      "Vestlusõhtu Eesti pöördelisest kümnendist: taasiseseisvumine, kroon, läänekaubad, popkultuur ja muutuv igapäevaelu.",
    startsAt: "2026-10-24T18:00",
    location: "Rapla Kultuurikeskus",
    tags: ["vestlusõhtu", "lähiajalugu", "Eesti"],
  },
];