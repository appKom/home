"use client";
import dynamic from "next/dynamic";
import { Button } from "../Button";
import TextInput from "./TextInput";
import ImageUploader from "./ImageUploader";
import { MemberSelect } from "./SelectMember";
import { memberType, RolesByPeriod } from "@/lib/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

interface ContentEditorProps {
  contentTitle: string;
  content: string;
  title: string;
  setTitle: (title: string) => void;
  setImage: (image: File | null) => void;
  setAuthorId: (author: number) => void;
  resetImageUploader: boolean;
  imageDescription: string;
  setImageDescription: (description: string) => void;
  handleSubmit: () => void;
  showPreview: boolean;
  setShowPreview: (showPreview: boolean) => void;
  handleEditorChange: (newContent: string) => void;
  authorId?: number | null;
  initialImageUrl?: string;
}

const ContentEditor = ({
  contentTitle,
  title,
  setTitle,
  content,
  setImage,
  setAuthorId,
  resetImageUploader,
  imageDescription,
  setImageDescription,
  handleSubmit,
  handleEditorChange,
  authorId,
  initialImageUrl,
}: ContentEditorProps) => {
  const [members, setMembers] = useState<memberType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/admin/member");
        if (response.ok) {
          const data = await response.json();

          const normalizedMembers = data.members.map((member: any) => {
            if (Array.isArray(member.rolesByPeriod)) {
              const rolesByPeriodObject: RolesByPeriod = {};
              member.rolesByPeriod.forEach((pr: any) => {
                if (pr.period && pr.role) {
                  rolesByPeriodObject[pr.period] = pr.role;
                }
              });
              return { ...member, rolesByPeriod: rolesByPeriodObject };
            }
            return member;
          });

          normalizedMembers.sort(
            (a: memberType, b: memberType) =>
              new Date(
                Object.keys(b.rolesByPeriod)[0].split(" - ")[1]
              ).getTime() -
              new Date(
                Object.keys(a.rolesByPeriod)[0].split(" - ")[1]
              ).getTime()
          );

          setMembers(normalizedMembers);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Klarte ikke å hente medlemmer: ${error.message}`);
        } else {
          toast.error("Klarte ikke å hente medlemmer");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (isLoading) {
    return (
      <div className=" min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2  mb-4"></div>
          <h2 className="text-2xl font-semibold">
            Laster inn administrasjonspanel...
          </h2>
          <p className="text-slate-400 mt-2">
            Vennligst vent mens vi henter informasjonen din
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex-col max-w-5xl">
        <h2 className="text-4xl text-center">{`${contentTitle}`} </h2>
        <ImageUploader
          onImageUpload={setImage}
          reset={resetImageUploader}
          initialImageUrl={initialImageUrl}
        />
        <MemberSelect
          members={members}
          onSelect={setAuthorId}
          initialSelectedMemberId={authorId}
        />
        <div className="w-full max-w-3xl mt-10">
          <TextInput
            label="Bildebeskrivelse"
            defaultValue={imageDescription}
            size="3xl"
            updateInputValues={setImageDescription}
            placeholder="Bildebeskrivelse"
          />
        </div>
        <div className="w-full max-w-3xl">
          <TextInput
            label="Overskrift"
            defaultValue={title}
            size="3xl"
            updateInputValues={setTitle}
            placeholder="Overskrift"
          />
        </div>

        <div className="w-full max-w-3xl">
          <QuillEditor
            value={content}
            onChange={handleEditorChange}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Skriv innholdet her..."
            className="w-full h-[300px] mt-10 text-white"
          />
        </div>
        <div className="w-full max-w-3xl mt-4"></div>

        <div className="flex flex-row items-center justify-center py-10 gap-6">
          {/* <Button
            title={`${showPreview ? "Skjul" : "Forhåndsvisning"}`}
            color="onlineOrange"
            onClick={() => setShowPreview(!showPreview)}
          /> */}
          <Button title="Send" color="onlineOrange" onClick={handleSubmit} />
        </div>
      </div>
    </>
  );
};

export default ContentEditor;
