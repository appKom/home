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

const LoadingBar = ({ progress }: any) => (
  <div className="w-full h-5 bg-gray-200">
    <div
      className="h-5 bg-blue-500"
      style={{ width: `${progress}%`, transition: "width 0.2s" }}
    ></div>
  </div>
);

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [resetImageUploader, setResetImageUploader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  const [articleData, setArticleData] = useState<DeepPartial<articleType>>({
    title: "",
    description: "",
    imageUri: "",
    imageDescription: "",
  });

  useEffect(() => {
    setArticleData((prev: DeepPartial<articleType>) => ({
      ...prev,
      title,
      description: content,
      imageDescription,
    }));
  }, [title, content, imageDescription]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setLoadingProgress(20);

    if (!articleData.title) {
      toast.error("Vennligst skriv en tittel");
      setIsLoading(false);
      return;
    }

    let uploadedImageUrl = "";
    if (image) {
      uploadedImageUrl = await uploadImage(image, articleData.title, false);
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

      // Reset all fields after successful submission
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
      toast.error("Kunne ikke sende inn!");
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
    <div className="relative px-8 flex flex-col items-center">
      <ContentEditor
        contentTitle={"Opprett en artikkel"}
        content={content}
        title={title}
        setTitle={setTitle}
        setContent={setContent}
        image={image}
        setImage={setImage}
        resetImageUploader={false}
        imageDescription={imageDescription}
        setImageDescription={setImageDescription}
        handleSubmit={handleSubmit}
        showPreview={false}
        setShowPreview={setShowPreview}
        handleEditorChange={handleEditorChange}
      />
      {
        showPreview && null
        // <div className="fixed inset-0 bg-white z-50 flex justify-center items-center overflow-auto">
        //   <div className="relative bg-white p-8 rounded shadow-lg max-h-full overflow-auto">
        //     {/* X Button */}
        //     <button
        //       className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        //       onClick={() => setShowPreview(false)}
        //     >
        //       &#x2715;
        //     </button>
        //     <ArticleDisplay
        //       article={{
        //         id: 0,
        //         title: articleData.title ?? "",
        //         description: articleData.description ?? "",
        //         author: {
        //           firstName: "",
        //           lastName: "",
        //           email: "",
        //           phone: "",
        //         },
        //         content: content,
        //         imageUri: image ?? "",
        //         imageDescription: articleData.imageDescription ?? "",
        //         createdAt: new Date(),
        //         updatedAt: new Date(),
        //       }}
        //     />
        //     <div className="text-center">
        //       <Button
        //         title="Lukk forhåndsvisning"
        //         color="onlineOrange"
        //         onClick={() => setShowPreview(false)}
        //       />
        //     </div>
        //   </div>
        // </div>
      }
    </div>
  );
}
