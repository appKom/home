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
  projects?: string[];
};

export type projectType = {
  title: string;
  shortDescription: string;
  description: string;
  imageUri: string;
  href: string;
};
