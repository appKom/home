export type articleType = {
  id: number;
  title: string;
  description: string;
  memberId: number;
  author?: memberType;
  imageUri: string;
  imageDescription: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RoleByPeriodType = {
  id: number;
  period: string;
  role: "Leder" | "Nestleder" | "Økonomiansvarlig" | "Medlem";
};

export type memberType = {
  id: number;
  name: string;
  href: string;
  imageUri?: string | null;
  isCurrent: boolean;
  about?: string | null;
  quote?: string | null;
  rolesByPeriod?: RoleByPeriodType[];
  email?: string | null;
  phone?: string | null;
  github?: string | null;
  linkedin?: string | null;
};

export type ProjectRole = "Prosjektleder" | "Prosjektmedlem";

export type ProjectMemberType = {
  role: ProjectRole;
  member: memberType;
};

export type projectType = {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  imageUri: string;
  href: string;
  techStack?: string[];
  link?: string;
  github: string;
  createdAt: Date;
  updatedAt: Date;
  projectMembers: ProjectMemberType[];
};

export type tParams = Promise<{ id: string }>;
