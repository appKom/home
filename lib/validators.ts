import toast from "react-hot-toast";
import { ProjectMember } from "./types";

interface articleProps {
  title: string;
  description: string | undefined;
  image: File | null;
  imageDescription: string | undefined;
  authorId: number | undefined | null;
}

export const validateArticle = (props: articleProps): boolean => {
  if (!props.title) {
    toast.error("Vennligst fyll ut tittel");
    return false;
  }

  if (!props.description) {
    toast.error("Vennligst fyll ut innhold");
    return false;
  }

  // if (!props.image) {
  //   toast.error("Vennligst last opp et bilde");
  //   return false;
  // }

  if (!props.imageDescription) {
    toast.error("Vennligst fyll ut bildebeskrivelse");
    return false;
  }

  if (!props.authorId) {
    toast.error("Vennligst velg forfatter");
    return false;
  }

  return true;
};

interface memberProps {
  name: string;
  rolesByPeriod: {
    period: string;
    role: "Leder" | "Nestleder" | "Okonomiansvarlig" | "Medlem";
  }[];
}

export const validateMember = (props: memberProps): boolean => {
  if (!props.name) {
    toast.error("Vennligst fyll ut navn");
    return false;
  }

  if (props.rolesByPeriod.length === 0) {
    toast.error("Vennligst velg minst én rolle");
    return false;
  }

  return true;
};

interface projectProps {
  title: string;
  description: string;
  image: File | null;
  techStack: string;
  projectMembers: ProjectMember[];
}

export const validateProject = (props: projectProps): boolean => {
  if (!props.title) {
    toast.error("Vennligst fyll ut tittel");
    return false;
  }
  if (!props.description) {
    toast.error("Vennligst fyll ut beskrivelse");
    return false;
  }

  if (!props.image) {
    toast.error("Vennligst last opp et bilde");
    return false;
  }

  if (!props.techStack) {
    toast.error("Vennligst fyll ut teknologier");
    return false;
  }

  if (props.projectMembers.length === 0) {
    toast.error("Vennligst legg til minst én prosjektdeltaker");
    return false;
  }

  return true;
};
