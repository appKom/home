export type blogType = {
  title: string;
  author?: string;
  content: string;
  imageUri: string;
  createdAt: Date;
};

export type memberType = {
  name: string;
  href: string;
  imageUri?: string;
  about?: string;
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
  github: string;
  people: {
    role: "Prosjektleder" | "Prosjektmedlem";
    name: string;
  }[];
};
