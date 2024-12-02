"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";
import { articleType, DeepPartial } from "@/lib/types";
import ContentEditor from "@/components/form/ContentEditor";
import {
  extractAndUploadImages,
  uploadImage,
} from "@/lib/admin/upload/uploadImage";
import { useParams } from "next/navigation";

const LoadingBar = ({ progress }: { progress: number }) => (
  <div className="w-full h-5 bg-gray-200">
    <div
      className="h-5 bg-blue-500"
      style={{ width: `${progress}%`, transition: "width 0.2s" }}
    ></div>
  </div>
);

export default function BloggEditPage() {
  const [title, setTitle] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [authorId, setAuthorId] = useState<number | null>(null);
  const [resetImageUploader, setResetImageUploader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { id } = useParams<{ id: string }>();

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  const [articleData, setArticleData] = useState<DeepPartial<articleType>>({});

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const response = await fetch(`/api/admin/article/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch article data");
        }
        const article = await response.json();
        setArticleData(article);
      } catch (error) {
        toast.error(
          "Failed to fetch article data: " + (error as Error).message
        );
      }
    };

    fetchArticleData();
  }, [id]);

  useEffect(() => {
    setArticleData((prev: DeepPartial<articleType>) => ({
      ...prev,
      title,
      description: content,
      imageDescription,
      authorId: authorId ?? undefined,
    }));
  }, [title, content, imageDescription, authorId]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setLoadingProgress(20);

    if (!articleData.title) {
      toast.error("Please enter a title");
      setIsLoading(false);
      return;
    }

    let uploadedImageUrl: string = "";

    if (image) {
      const result = await uploadImage(image, articleData.title);
      if (result) {
        uploadedImageUrl = result;
      } else {
        toast.error("Image upload failed");
        setIsLoading(false);
        return;
      }
    }

    setLoadingProgress(50);

    setLoadingProgress(70);

    const updatedContent = await extractAndUploadImages(content);

    const article = {
      ...articleData,
      imageUri: uploadedImageUrl,
      description: updatedContent,
    };

    try {
      const response = await fetch(`/api/admin/article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      toast.success("Artikkel sendt inn!");
      setLoadingProgress(100);

      setTitle("");
      setImageDescription("");
      setContent("");
      setImage(null);
      setResetImageUploader(true);
      setArticleData({
        title: "",
        description: "",
        imageUri: "",
        imageDescription: "",
      });
      setTimeout(() => setResetImageUploader(false), 100);
    } catch (error) {
      toast.error("Det skjedde en feil, plzz prøv på nytt!" + error);
      setLoadingProgress(0);
    } finally {
      setIsLoading(false);
    }
  }, [articleData, image, content]);

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
    <div className=" px-8 flex flex-col w-full items-center">
      <ContentEditor
        contentTitle={"Opprett en artikkel"}
        content={content}
        title={title}
        setTitle={setTitle}
        setAuthorId={setAuthorId}
        setImage={setImage}
        resetImageUploader={resetImageUploader}
        imageDescription={imageDescription}
        setImageDescription={setImageDescription}
        handleSubmit={handleSubmit}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        handleEditorChange={handleEditorChange}
      />

      {showPreview && null /* TODO */}
    </div>
  );
}
