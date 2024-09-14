export type blogType = {
  title: string;
  author?: memberType;
  content: string;
  imageUri: string;
  createdAt: Date;
};

export type memberType = {
  name: string;
  href: string;
  imageUri?: string;
  about?: string;
  memberSince: string;
  role: "Leder" | "Nestleder" | "Økonomiansvarlig" | "Medlem";
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
};

export type projectType = {
  title: string;
  shortDescription: string;
  description: string;
  imageUri: string;
  href: string;
  techStack?: string[];
  people: {
    role: "Prosjektleder" | "Prosjektmedlem";
    name: string;
  }[];
};