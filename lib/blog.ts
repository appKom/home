import { blogType } from "./types";

export const blogs: blogType[] = [
  {
    title: "Første commit",
    author: "Fredrik Carsten Hansteen",
    content: `
## Første commit!

Velkommen skal du være til Appkoms første dev blogg. Forhåpentligvis kommer vi her til å komme med månedlige oppdateringer på hva vi har drevet med i det siste. Først og fremst litt om oss. Denne høsten nå har vi hatt gleden å av å ta imot 5 splitter nye appkommere. Disse har kommet godt i gang i å begynne på deres første Appkom prosjekt.  


## Opptakssiden

Denne høsten hadde vi gleden av å lansere en opptaksside for Online for aller første gang. På [opptak.online.ntnu.no](opptak.online.ntnu.no) kan de som ønsker å søke verv søke gjennom vår portal. Etter mange lange dager og hardt arbeid gjennom sommeren, sto siden endelig klar! Lanseringen gikk relativt knirkefritt, og vi ser fram til at siden kommer til å bli brukt til alle fremtidige opptak. Mer om prosjektet kan du lese [her](https://www.appkom.no/prosjekt/online-opptak) 

## Inforskjermen

Har du tatt en tur på A4 i det siste og lagt merke til at noe har blitt enda bedre? Hvis ikke, ta deg en tur å så på vår flotte infoskjerm. Infoskjermen på A4 har nemlig nå fått en heftig oppdatering, og med ferskt design viser den arrangementer fra OW samt memes og info fra Online slacken. Ta en titt da vel:
![bilde av infoskjermen](https://www.appkom.no/blogg/infoskjerm-lansering.jpg)

Med kram og kærleik,
Appkom

    `,
    imageUri: "/blogg/første-commit.png",
    createdAt: new Date("2024-09-15T15:20:05Z"),
  },
];
