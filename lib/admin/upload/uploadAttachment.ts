import axios from "axios";

export const uploadAttachments = async (files: File[]) => {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "/api/admin/upload/attachment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.url;
    } catch (error) {
      console.error("Attachment upload failed:", error);
      return null;
    }
  });

  return Promise.all(uploadPromises);
};
