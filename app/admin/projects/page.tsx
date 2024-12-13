"use client";

import { useState, useRef, useEffect } from "react";
import { UserPlus, Upload, XIcon, Edit } from "lucide-react";
import toast from "react-hot-toast";
import TextInput from "@/components/form/TextInput";
import OptionsBox from "@/components/form/OptionsBox";
import Checkbox from "@/components/form/Checkbox";
import Table from "@/components/form/Table";
import Image from "next/image";
import TextAreaInput from "@/components/form/TextAreaInput";
import { ProjectMember, projectType } from "@/lib/types";

const LoadingBar = ({ progress }: { progress: number }) => (
  <div className="w-full h-5 bg-gray-200">
    <div
      className="h-5 bg-blue-500"
      style={{ width: `${progress}%`, transition: "width 0.2s" }}
    ></div>
  </div>
);

const AdminProjectPage = () => {
  const [projects, setProjects] = useState<projectType[]>([]);
  const [editingProject, setEditingProject] = useState<projectType | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [techStack, setTechStack] = useState("");
  const [link, setLink] = useState("");
  const [github, setGithub] = useState("");
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setLoadingProgress(10);
      try {
        const response = await fetch("/api/admin/project");
        if (response.ok) {
          setLoadingProgress(30);
          const data = await response.json();
          setLoadingProgress(50);

          setLoadingProgress(80);

          setProjects(data.projects);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Klarte ikke å hente Prosjektmer: ${error.message}`);
        } else {
          toast.error("Klarte ikke å hente Prosjektmer");
        }
      } finally {
        setLoadingProgress(100);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleEdit = (project: projectType) => {
    setEditingProject(project);
    setTitle(project.title);
    setShortDescription(project.shortDescription);
    setDescription(project.description);
    setImageUri(project.imageUri);
    setTechStack(project.techStack || "");
    setLink(project.link || "");
    setGithub(project.github);
    setProjectMembers(project.projectMembers || []);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("shortDescription", shortDescription);
    formData.append("description", description);
    formData.append("techStack", techStack);
    formData.append("link", link);
    formData.append("github", github);
    if (image) {
      formData.append("image", image);
    }
    formData.append("projectMembers", JSON.stringify(projectMembers));
    try {
      let response;

      if (editingProject) {
        formData.append("id", editingProject.id.toString());
        response = await fetch("/api/admin/project", {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch("/api/admin/project", {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        toast.success(
          editingProject ? "Prosjekt oppdatert" : "Prosjekt lagt til!"
        );
        resetForm();

        const responseData = await response.json();

        if (editingProject) {
          setProjects(
            projects.map((project) =>
              project.id === editingProject.id ? responseData : project
            )
          );
        } else {
          setProjects([...projects, responseData]);
        }

        setEditingProject(null);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          `Failed to ${editingProject ? "update" : "add"} project: ${
            error.message
          }`
        );
      } else {
        toast.error(
          editingProject
            ? "Klarte ikke å oppdatere Prosjekt"
            : "Klarte ikke å legge til Prosjekt"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette dette Prosjektet?"
    );
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/admin/project", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setProjects(projects.filter((project) => project.id !== id));
        toast.success("Prosjekt fjernet!");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to remove project: ${error.message}`);
      } else {
        toast.error("Failed to remove project");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setShortDescription("");
    setDescription("");
    setImageUri("");
    setTechStack("");
    setLink("");
    setGithub("");
    setProjectMembers([]);
    setImage(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const columns = [
    {
      header: "Prosjekt",
      accessor: "title" as keyof projectType,
    },
    {
      header: "Bilde",
      accessor: "imageUri" as keyof projectType,
      renderCell: (project: projectType) =>
        project.imageUri ? (
          <Image
            height={50}
            width={50}
            src={project.imageUri}
            alt={project.title}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        ),
    },
    {
      header: "Medlemmer",
      accessor: "projectMembers" as keyof projectType,
      renderCell: (project: projectType) => {
        const sortedMembers =
          project.projectMembers?.sort((a, b) =>
            a.Member.name.localeCompare(b.Member.name)
          ) || [];
        return (
          <ul className="list-disc list-inside">
            {sortedMembers.map((member) => (
              <li key={member.id}>
                {member.Member.name} - {member.Role}
              </li>
            ))}
          </ul>
        );
      },
    },
  ];

  const tableData = projects.map((project) => ({
    ...project,
  }));

  useEffect(() => {
    if (isLoading && loadingBarRef.current) {
      loadingBarRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div
        className="h-screen flex flex-col justify-center items-center px-8"
        ref={loadingBarRef}
      >
        <h1 className="text-3xl">Laster...</h1>
        <LoadingBar progress={loadingProgress} />
      </div>
    );
  }

  return (
    <div className="py-4 px-5 w-full items-start max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Administrer Prosjektmer</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <TextInput
          id="title"
          label="Tittel"
          defaultValue={title}
          updateInputValues={(value: string) => setTitle(value)}
          required
          size="medium"
        />
        <TextInput
          id="shortDescription"
          label="Kort Beskrivelse"
          defaultValue={shortDescription}
          updateInputValues={(value: string) => setShortDescription(value)}
          size="medium"
        />
        <div>
          <div className="flex items-center gap-4 mt-4">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Upload className="inline-block mr-2 h-4 w-4" />
              Last opp bilde
            </button>

            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Preview"
                height={40}
                width={40}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
          </div>
        </div>
        <TextAreaInput
          id={"description"}
          label={"Beskrivelse"}
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
        />
        <TextInput
          id="github"
          label="Github"
          defaultValue={github}
          updateInputValues={(value: string) => setGithub(value)}
          size="medium"
        />
        <TextInput
          id="link"
          label="Link / URL"
          defaultValue={link}
          updateInputValues={(value: string) => setLink(value)}
          size="medium"
        />
        <TextInput
          id="techStack"
          label="Teknologi stakk (Obs: komma-separert)"
          defaultValue={techStack}
          updateInputValues={(value: string) => setTechStack(value)}
          size="medium"
        />

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {editingProject ? (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Oppdater Prosjekt
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Legg til Prosjekt
            </>
          )}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Prosjektsliste</h2>
      {isLoading ? (
        <div className="text-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2 border-onlineyellow mb-4"></div>
            <h2 className="text-2xl font-semibold">
              Laster inn Prosjektmer...
            </h2>
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          data={tableData}
          renderRowActions={(project: projectType) => (
            <>
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleRemove(project.id)}
                className="text-red-500 hover:text-red-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </>
          )}
        />
      )}
    </div>
  );
};

export default AdminProjectPage;
