import axios from "axios";

export const uploadImage = async (
  image: string,
  fileName: string,
  base64: boolean
) => {
  if (image) {
    try {
      if (!base64) {
        const base64Image = image.split(",")[1];
        const response = await axios.post("/api/admin/upload/image", {
          base64Image,
          fileName: fileName,
        });
        return response.data.url;
      } else {
        const response = await axios.post("/api/admin/upload/image", {
          base64Image: image,
          fileName: fileName,
        });
        return response.data.url;
      }
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
    const extension = match[1];
    const fileName = `image_${Date.now()}_${index}.${extension}`;

    try {
      const imageUrl = await uploadImage(base64String, fileName, true);
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
