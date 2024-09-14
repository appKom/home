"use client";
import { useState } from "react";
import { projects } from "@/lib/projects";
import { ProjectCard } from "./home/ProjectCard";
import { Button } from "./Button";

export default function ProjectGrid() {
  const [showAll, setShowAll] = useState(false);

  const handleShowAllProjects = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.slice(0, showAll ? projects.length : 4).map((project) => (
          <ProjectCard project={project} key={project.title} />
        ))}
      </div>
      <div className="justify-between items-center text-center">
        <Button
          title={showAll ? "Vis færre prosjekter" : "Se alle prosjekter"}
          onClick={handleShowAllProjects}
          color={"onlineOrange"}
        />
      </div>
    </div>
  );
}
