"use client";

import { projectType } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

interface ProjectTableProps {
  projects: projectType[];
}

const ProjectTable = ({ projects }: ProjectTableProps) => {
  const [projectList, setprojectList] = useState(projects);
  const [isLoading, setIsLoading] = useState(false);

  const deleteproject = async (id: number) => {
    const confirmed = confirm(
      "Er du sikker på at du vil slette denne projectgen?",
    );
    if (!confirmed) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/project/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("projectgen ble slettet.");
        setprojectList(projectList.filter((project) => project.id !== id));
      } else {
        toast.error("Failed to delete the project.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("An error occurred while deleting the project.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className=" text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2  mb-4"></div>
          <h2 className="text-2xl font-semibold">Sletter projectg...</h2>
          <p className="text-slate-400 mt-2">
            {`Vennligst vent mens projectgen blir slettet :)`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projectList.map((project) => (
          <Link
            href={`/admin/projectg/edit/${project.id}`}
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <Image
              src={project.imageUri}
              alt={"Image of project"}
              width={300}
              height={300}
              className="w-full h-40 object-cover"
            />
            <div className="p-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                {project.title}
              </h2>

              <div className="flex justify-around  ">
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    deleteproject(project.id);
                  }}
                  className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors duration-200"
                >
                  Slett
                </button>
                <div className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-200">
                  Rediger
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectTable;
