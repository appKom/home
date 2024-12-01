"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface ImageUploaderProps {
  onImageUpload: (image: string | null) => void;
  reset: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  reset,
}) => {
  const [image, setImage] = useState<string | null>(null);

  const onDropImage = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        onImageUpload(result);
      };

      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropImage,
    accept: {
      "image/*": [],
    },
  });

  useEffect(() => {
    if (reset) {
      setImage(null);
    }
  }, [reset]);

  return (
    <div
      {...getRootProps()}
      className="border-dashed border-2 border-gray-300 p-5 mt-5 w-full max-w-3xl text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {image ? (
        <Image src={image} alt="Uploaded image" width={300} height={300} />
      ) : (
        <p>Dra og slipp bildet her, eller klikk for å velge</p>
      )}
    </div>
  );
};

export default ImageUploader;
