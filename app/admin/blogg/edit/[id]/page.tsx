"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";
import { DeepPartial } from "@/lib/types";
import ContentEditor from "@/components/form/ContentEditor";
import {
  extractAndUploadImages,
  uploadImage,
} from "@/lib/admin/upload/uploadImage";
import { useParams } from "next/navigation";

type createArticleType = {
  title: string;
  description: string;
  imageDescription: string;
  authorId: number | null;
  imageUri: string;
};

const LoadingBar = ({ progress }: { progress: number }) => (
  <div className="w-full h-5 bg-gray-200">
    <div
      className="h-5 bg-blue-500"
      style={{ width: `${progress}%`, transition: "width 0.2s" }}
    ></div>
  </div>
);

export default function BloggEditPage() {
  const [image, setImage] = useState<File | null>(null);
  const [resetImageUploader, setResetImageUploader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<
    DeepPartial<createArticleType> & { imageUri?: string }
  >({
    title: "",
    description: "",
    imageDescription: "",
    authorId: undefined,
  });

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setIsLoading(true);
        setLoadingProgress(10);
        const response = await fetch(`/api/admin/article/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch article data");
        }
        setLoadingProgress(50);
        const article = await response.json();
        setFormData({
          title: article.article.title || "",
          description: article.article.description || "",
          imageDescription: article.article.imageDescription || "",
          authorId: article.article.authorId || null,
          imageUri: article.article.imageUri || "",
        });
      } catch (error) {
        toast.error(
          "Failed to fetch article data: " + (error as Error).message
        );
      } finally {
        setLoadingProgress(100);
        setIsLoading(false);
      }
    };

    fetchArticleData();
  }, [id]);

  const handleChange = <K extends keyof DeepPartial<createArticleType>>(
    field: K,
    value: DeepPartial<createArticleType>[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setLoadingProgress(20);

    if (!formData.title) {
      toast.error("Please enter a title");
      setIsLoading(false);
      return;
    }

    let uploadedImageUrl: string = formData.imageUri || "";

    if (image) {
      const result = await uploadImage(image, formData.title);
      if (result) {
        uploadedImageUrl = result;

        setFormData((prev) => ({
          ...prev,
          imageUri: uploadedImageUrl,
        }));
      } else {
        toast.error("Image upload failed");
        setIsLoading(false);
        return;
      }
    }

    setLoadingProgress(50);

    setLoadingProgress(70);

    if (!formData.description) {
      toast.error("Please enter a description");
      setIsLoading(false);
      return;
    }
    const updatedContent = await extractAndUploadImages(formData.description);

    const article = {
      ...formData,
      imageUri: uploadedImageUrl,
      description: updatedContent,
    };

    try {
      const response = await fetch(`/api/admin/article/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      toast.success("Artikkel oppdatert inn!");
      setLoadingProgress(100);

      setTimeout(() => setResetImageUploader(false), 100);
    } catch (error) {
      toast.error("Det skjedde en feil, plzz prøv på nytt!" + error);
      setLoadingProgress(0);
    } finally {
      setIsLoading(false);
    }
  }, [formData, image]);

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
    <div className=" px-8 flex flex-col w-full max-w-3xl">
      <ContentEditor
        contentTitle={"Opprett en artikkel"}
        content={formData.description || ""}
        title={formData.title || ""}
        setTitle={(value) => handleChange("title", value)}
        setAuthorId={(value) => handleChange("authorId", value)}
        authorId={formData.authorId}
        setImage={setImage}
        resetImageUploader={resetImageUploader}
        imageDescription={formData.imageDescription || ""}
        setImageDescription={(value) => handleChange("imageDescription", value)}
        handleSubmit={handleSubmit}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        handleEditorChange={(value) => handleChange("description", value)}
        initialImageUrl={formData.imageUri}
      />

      {showPreview && null /* TODO */}
    </div>
  );
}
