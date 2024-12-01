export type articleType = {
  id: number;
  title: string;
  description: string;
  authorId: number;
  author?: memberType;
  imageUri: string;
  imageDescription: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type memberType = {
  id: number;
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
