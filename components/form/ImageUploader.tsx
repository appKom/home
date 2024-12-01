"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface ImageUploaderProps {
  onImageUpload: (imageFile: File | null) => void;
  reset: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  reset,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  //eslint-disable-next-line
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDropImage = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropImage,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  useEffect(() => {
    if (reset) {
      setSelectedFile(null);
      setImagePreview(null);
    }
  }, [reset]);

  return (
    <div
      {...getRootProps()}
      className="border-dashed border-2 border-gray-300 p-5 mt-5 w-full max-w-3xl text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {imagePreview ? (
        <Image
          src={imagePreview}
          alt="Uploaded image"
          width={300}
          height={300}
        />
      ) : (
        <p>Drag and drop the image here, or click to select</p>
      )}
    </div>
  );
};

export default ImageUploader;
