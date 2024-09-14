import { projectType } from "./types";

export const projects: projectType[] = [
  {
    title: "Online-Opptak",
    shortDescription:
      "Opptaksside for medlemmer av Online linjeforening som ønsker å søke verv.",
    description:
      "Opptaksside for medlemmer av Online linjeforening som ønsker å søke verv.",
    imageUri: "/prosjekt/online-opptak.png",
    href: "/prosjekt/online-opptak",
    techStack: [
      "Next.js",
      "Tailwind CSS",
      "Vercel",
      "AWS",
      "MongoDB",
      "Twilio",
    ],
    people: [
      {
        role: "Prosjektleder",
        name: "/medlem/Julian-Ammouche-Ottosen",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Fredrik-Hansteen",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Sindre-Emil-Halleraker",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Jorgen-Galdal",
      },
    ],
  },

  {
    title: "Online-Appen",
    shortDescription:
      "En app for Online linjeforening. Der brukere kan se nyheter, arrangementer og annet innhold.",
    description: "Online Appen",
    imageUri: "/prosjekt/online-appen.jpg",
    href: "/prosjekt/online-appen",
    techStack: ["Flutter", "Firebase", "Dart", "Google Cloud Platform"],
    people: [
      {
        role: "Prosjektleder",
        name: "/medlem/Erlend-Lovoll-Strom",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Fredrik-Hansteen",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Johannes-Hage",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Mads-Hermansen",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Amund-Dahlmo-Berge",
      },
    ],
  },
  {
    title: "Autobank",
    shortDescription: "Autobank",
    description: "Autobank",
    imageUri: "/prosjekt/autobank.png",
    href: "/prosjekt/autobank",
    people: [
      {
        role: "Prosjektleder",
        name: "/medlem/Emily-Malcomsen",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Mats-Nyfloet",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Aksel-Fosaas",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Dina-Marie-Stensrud",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Adel-Strysse",
      },
      {
        role: "Prosjektmedlem",
        name: "/medlem/Victoria-Naesheim",
      },
    ],
  },
  {
    title: "Online-Fondet",
    shortDescription: "Fondside",
    description: "Fondside",
    imageUri: "/prosjekt/online-fondet.png",
    href: "/prosjekt/online-fondet",
    people: [
      {
        role: "Prosjektleder",
        name: "/medlem/Aksel-Fosaas",
      },
    ],
  },
];
