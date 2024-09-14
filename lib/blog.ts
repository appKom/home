import { blogType } from "./types";
import { members } from "./members";

export const blogs: blogType[] = [
  {
    title: "Første commit",
    author: members.find((member) => member.name === "Fredrik Hansteen"),
    content: "Dette er appkoms første commit",
    imageUri: "/blogg/appkom-paa-immball.jpg",
    createdAt: new Date("2024-09-14T12:35:20Z"),
  },
  {
    title: "Andre commit",
    author: members.find((member) => member.name === "Fredrik Hansteen"),
    content: "Dette er appkoms første commit",
    imageUri: "/blogg/appkom-paa-immball.jpg",
    createdAt: new Date("2024-09-15T12:35:20Z"),
  },
  {
    title: "Tredje commit",
    author: members.find((member) => member.name === "Fredrik Hansteen"),
    content: "Dette er appkoms første commit",
    imageUri: "/blogg/appkom-paa-immball.jpg",
    createdAt: new Date("2024-09-16T12:35:20Z"),
  },
  {
    title: "Fjerde commit",
    author: members.find((member) => member.name === "Fredrik Hansteen"),
    content: "Dette er appkoms første commit",
    imageUri: "/blogg/appkom-paa-immball.jpg",
    createdAt: new Date("2024-09-17T12:35:20Z"),
  },
];
