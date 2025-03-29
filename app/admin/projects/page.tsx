"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, XIcon, Edit, FileText } from "lucide-react";
import toast from "react-hot-toast";
import TextInput from "@/components/form/TextInput";
import Table from "@/components/form/Table";
import Image from "next/image";
import { ProjectMember, projectType } from "@/lib/types";
import { MemberSelect } from "@/components/form/SelectMember";
import { validateProject } from "@/lib/validators";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { extractAndUploadImages } from "@/lib/admin/upload/uploadImage";
type ProjectRole = "Prosjektleder" | "Bidragsyter";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    [{ align: [] }],
    [{ color: [] }],
    ["code-block"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "link",
  "image",
  "align",
  "color",
  "code-block",
];

const LoadingBar = ({ progress }: { progress: number }) => (
  <div className="h-5 w-full bg-gray-200">
    <div
      className="h-5 bg-blue-500"
      style={{ width: `${progress}%`, transition: "width 0.2s" }}
    ></div>
  </div>
);

const AdminProjectPage = () => {
  const [projects, setProjects] = useState<projectType[]>([]);
  const [editingProject, setEditingProject] = useState<projectType | null>(
    null,
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

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedMemberName, setSelectedMemberName] = useState<string | null>(
    null,
  );
  const [selectedRole, setSelectedRole] = useState<ProjectRole>("Bidragsyter");

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
          setProjects(data.projects);
          setLoadingProgress(80);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Klarte ikke å hente Prosjekter: ${error.message}`);
        } else {
          toast.error("Klarte ikke å hente Prosjekter");
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
    const updatedDescription = await extractAndUploadImages(description);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("shortDescription", shortDescription);
    formData.append("description", updatedDescription);
    formData.append("techStack", techStack);
    formData.append("link", link);
    formData.append("github", github);
    if (image) {
      formData.append("image", image);
    }

    formData.append("projectMembers", JSON.stringify(projectMembers));

    if (
      !validateProject({
        title,
        description: updatedDescription,
        image,
        techStack,
        projectMembers,
      })
    ) {
      setIsLoading(false);
      return;
    }

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
          editingProject ? "Prosjekt oppdatert" : "Prosjekt lagt til!",
        );
        const responseData = await response.json();

        if (editingProject) {
          setProjects(
            projects.map((project) =>
              project.id === editingProject.id ? responseData : project,
            ),
          );
        } else {
          setProjects([...projects, responseData]);
        }

        resetForm();
        setEditingProject(null);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          `Failed to ${editingProject ? "update" : "add"} project: ${
            error.message
          }`,
        );
      } else {
        toast.error(
          editingProject
            ? "Klarte ikke å oppdatere Prosjekt"
            : "Klarte ikke å legge til Prosjekt",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette dette Prosjektet?",
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
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div>
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
          </div>
        ),
    },
    {
      header: "Medlemmer",
      accessor: "projectMembers" as keyof projectType,
      renderCell: (project: projectType) => {
        const sortedMembers =
          project.projectMembers?.sort((a, b) =>
            a.Member.name.localeCompare(b.Member.name),
          ) || [];
        return (
          <ul className="list-inside list-disc">
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

  const addMemberWithRole = () => {
    if (!selectedMemberId) {
      toast.error("Du må velge en medlem før du kan legge til!");
      return;
    }

    const newProjectMember: ProjectMember = {
      id: Date.now(),
      projectId: editingProject ? editingProject.id : 0,
      memberId: selectedMemberId,
      Role: selectedRole,
      Member: {
        id: selectedMemberId,
        name: selectedMemberId ? selectedMemberName || "" : "",
        href: "#",
        isCurrent: true,
      },
    };

    setProjectMembers((prev) => [...prev, newProjectMember]);

    setSelectedMemberId(null);
    setSelectedMemberName(null);
    setSelectedRole("Bidragsyter");
    toast.success("Medlem lagt til med valgt rolle!");
  };

  if (isLoading) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center px-8"
        ref={loadingBarRef}
      >
        <h1 className="text-3xl">Laster...</h1>
        <LoadingBar progress={loadingProgress} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl items-start px-5 py-4">
      <h1 className="mb-4 text-2xl font-bold">Administrer Prosjekter</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
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

        <div className="flex flex-col gap-2">
          <div className="mt-4 flex items-center gap-4">
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
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Upload className="mr-2 inline-block h-4 w-4" />
              Last opp bilde
            </button>
          </div>
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Preview"
              height={500}
              width={500}
              className="max-h-96 w-full object-cover"
            />
          )}
          {imageUri && !imagePreview && (
            <Image
              src={imageUri}
              alt="Preview"
              height={500}
              width={500}
              className="max-h-96 w-full object-cover"
            />
          )}
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-200">
            Beskrivelse
          </label>
          <QuillEditor
            value={description}
            onChange={setDescription}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Skriv innholdet her..."
            className="mb-24 mt-10 h-[300px] w-full text-white"
          />
        </div>
        <TextInput
          id="github"
          label="Github"
          defaultValue={github}
          updateInputValues={(value: string) => setGithub(value)}
          size="medium"
        />

        <div className="mt-8">
          <h3 className="mb-2 text-lg font-semibold">
            Legg til medlemmer med rolle
          </h3>
          <MemberSelect
            onSelect={setSelectedMemberId}
            onSelectName={setSelectedMemberName}
          />

          <label className="mb-2 mt-4 block text-sm font-medium text-gray-200">
            Velg Rolle
          </label>
          <select
            className="w-full rounded-md border border-gray-300 bg-gray-800 px-4 py-2 text-white"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as ProjectRole)}
          >
            <option value="Prosjektleder">Prosjektleder</option>
            <option value="Bidragsyter">Bidragsyter</option>
          </select>

          <button
            type="button"
            onClick={addMemberWithRole}
            className="mt-4 rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            Legg til medlem
          </button>
        </div>

        {projectMembers.map((pm, index) => (
          <li key={pm.id} className="flex items-center">
            Medlem: {pm.Member.name}, Rolle:
            <select
              value={pm.Role}
              className="ml-2 w-40 rounded-md border border-gray-300 bg-gray-800 px-4 py-1 text-white"
              onChange={(e) => {
                const newRole = e.target.value;
                setProjectMembers((prev) => {
                  const newArr = [...prev];
                  newArr[index] = {
                    ...newArr[index],
                    Role: newRole as ProjectRole,
                  };
                  return newArr;
                });
              }}
            >
              <option value="Prosjektleder">Prosjektleder</option>
              <option value="Bidragsyter">Bidragsyter</option>
            </select>
            <button
              onClick={() =>
                setProjectMembers((prev) =>
                  prev.filter((member) => member.id !== pm.id),
                )
              }
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <XIcon />
            </button>
          </li>
        ))}

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
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {editingProject ? (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Oppdater Prosjekt
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Legg til Prosjekt
            </>
          )}
        </button>
      </form>

      <h2 className="mb-2 text-xl font-semibold">Prosjektsliste</h2>
      {isLoading ? (
        <div className="flex items-center justify-center text-white">
          <div className="text-center">
            <div className="border-onlineyellow mb-4 inline-block h-16 w-16 animate-spin rounded-full border-y-2"></div>
            <h2 className="text-2xl font-semibold">Laster inn Prosjekter...</h2>
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
                className="mr-2 text-blue-500 hover:text-blue-700"
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
