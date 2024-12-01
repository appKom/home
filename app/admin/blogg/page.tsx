"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TextAreaInput from "@/components/form/TextAreaInput";
import TextInput from "@/components/form/TextInput";
import { blogType } from "@/lib/types";

const AdminBlogPage = () => {
  const [title, setTitle] = useState("");
  const [ingress, setIngress] = useState("");
  const [content, setContent] = useState("");

  const [attachment, setAttachment] = useState<File | null>(null);

  const [editingApplication, setEditingApplication] = useState<blogType | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<blogType[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/admin/application");
        if (response.ok) {
          const data = await response.json();

          setApplications(data.applications);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Klarte ikke å hente blogger: ${error.message}`);
        } else {
          toast.error("Klarte ikke å hente blogger");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      let response;

      if (editingApplication) {
        formData.append("id", editingApplication.id.toString());
        response = await fetch("/api/admin/application", {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch("/api/admin/application", {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        toast.success(
          editingApplication ? "Søknad oppdatert" : "Søknad lagt til!"
        );
        resetForm();

        if (editingApplication) {
          const updatedApplication = await response.json();
          setApplications(
            applications.map((application) =>
              application.id === editingApplication.id
                ? updatedApplication.application
                : application
            )
          );
        } else {
          setApplications([
            ...applications,
            (await response.json()).application,
          ]);
        }

        setEditingApplication(null);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to add application: ${error.message}`);
      } else {
        toast.error(
          editingApplication
            ? "Klarte ikke å oppdatere søknad"
            : "Klarte ikke å legge til søknad"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");

    setContent("");
    setEditingApplication(null);
    setAttachment(null);
  };

  const handleEdit = (application: blogType) => {
    setEditingApplication(application);
    setTitle(application.title);
    setContent(application.content || "");
  };

  const handleRemove = async (id: number) => {
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette denne søknaden?"
    );
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/admin/application", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setApplications(
          applications.filter((application) => application.id !== id)
        );
        toast.success("Søknad fjernet!");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Klarte ikke å fjerne søknad: ${error.message}`);
      } else {
        toast.error("Klarte ikke å fjerne søknad");
      }
    }
  };

  const columns = [
    {
      header: "Tittel",
      accessor: "title" as keyof blogType,
    },
  ];

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="w-full">
        <main className="flex flex-col w-full">
          <h1 className="text-2xl font-bold mb-4">Administrer blogger</h1>
          <form onSubmit={handleSubmit} className="space-y-4 mb-8 w-full ">
            <TextInput
              id="title"
              label="Tittel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextInput
              id="ingress"
              label="Ingress"
              value={ingress}
              onChange={(e) => setIngress(e.target.value)}
            />

            <TextAreaInput
              id="content"
              label="Innhold"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </form>

          <h2 className="text-xl font-semibold mb-2">Blogger</h2>
          {isLoading ? (
            <div className=" text-white flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2 border-onlineyellow mb-4"></div>
                <h2 className="text-2xl font-semibold">
                  Laster inn blogger...
                </h2>
              </div>
            </div>
          ) : // <Table
          //   columns={columns}
          //   data={applications}
          //   renderRowActions={(application: blogType) => (
          //     <>
          //       <button
          //         onClick={() => handleEdit(application)}
          //         className="text-blue-500 hover:text-blue-700 mr-2"
          //       >
          //         <Edit className="h-5 w-5" />
          //       </button>
          //       <button
          //         onClick={() => handleRemove(application.id)}
          //         className="text-red-500 hover:text-red-700"
          //       >
          //         <XIcon className="h-5 w-5" />
          //       </button>
          //     </>
          //   )}
          // />
          null}
        </main>
      </div>
    </div>
  );
};

export default AdminBlogPage;
