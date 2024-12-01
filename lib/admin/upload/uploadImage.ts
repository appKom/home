export const uploadImage = async (
  image: File,
  title: string
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);

    const response = await fetch("/api/admin/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const extractAndUploadImages = async (content: string) => {
  const imageRegex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"/g;
  const base64Images = Array.from(content.matchAll(imageRegex));

  const uploadPromises = base64Images.map(async (match, index) => {
    const mimeType = match[1];
    const base64String = match[2];
    const extension = mimeType.split("/")[1] || "png";
    const fileName = `image_${Date.now()}_${index}.${extension}`;

    try {
      const byteCharacters = atob(base64String);
      const byteNumbers = Array.from(byteCharacters).map((char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const file = new File([byteArray], fileName, {
        type: `image/${mimeType}`,
      });

      const imageUrl = await uploadImage(file, fileName);
      return { base64String, imageUrl, mimeType };
    } catch (error) {
      console.error(`Failed to upload image: ${fileName}`, error);
      return { base64String, imageUrl: "", mimeType };
    }
  });

  const uploadResults = await Promise.all(uploadPromises);

  let updatedContent = content;
  uploadResults.forEach(({ base64String, imageUrl, mimeType }) => {
    if (base64String && imageUrl) {
      const escapedBase64String = base64String.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      );
      const regex = new RegExp(
        `data:image/${mimeType};base64,${escapedBase64String}`,
        "g"
      );
      updatedContent = updatedContent.replace(regex, imageUrl);
    }
  });

  return updatedContent;
};
