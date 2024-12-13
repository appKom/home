import { Prisma } from "@prisma/client";

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
  role: "Leder" | "Nestleder" | "Okonomiansvarlig" | "Medlem";
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

type ProjectRole = "Prosjektleder" | "Bidragsyter";

export type ProjectMember = {
  id: number;
  projectId: number;
  memberId: number;
  Role: ProjectRole;
  Member: memberType;
};

export type projectType = {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  imageUri: string;
  href: string;
  techStack?: string;
  link?: string | null;
  github: string;
  createdAt: Date;
  updatedAt: Date;
  projectMembers?: ProjectMember[];
};

export type tParams = Promise<{ id: string }>;
