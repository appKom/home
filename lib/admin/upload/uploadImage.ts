import axios from "axios";

export const uploadImage = async (
  imageFile: File,
  fileName: string
): Promise<string | null> => {
  if (imageFile) {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("fileName", fileName);

      const response = await axios.post("/api/admin/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  }
  return null;
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
