export type blogType = {
  id: number;
  title: string;
  author?: string;
  ingress?: string;
  content: string;
  imageUri: string;
  createdAt: Date;
};

export type memberType = {
  name: string;
  href: string;
  imageUri?: string;
  about?: string;
  quote?: string;
  rolesByPeriod: {
    [period: string]: "Leder" | "Nestleder" | "Økonomiansvarlig" | "Medlem";
  };
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
  link?: string;
  github: string;
  people: {
    role: "Prosjektleder" | "Prosjektmedlem";
    name: string;
  }[];
};

export type tParams = Promise<{ id: string }>;
