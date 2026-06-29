import axiosClient from "../api/axiosClient";

interface UploadResult {
  imageUrl: string;
  fileName: string;
}

const StorageService = {
  /**
   * Uploads a file to the configured storage backend (local or S3).
   * @param file  The image file to upload (JPEG/PNG/WEBP, max 5 MB)
   * @param folder  Target folder: "products" | "marketing" | "banners"
   * @returns The public imageUrl to store in the entity
   */
  upload: async (file: File, folder: "products" | "marketing" | "banners" = "marketing"): Promise<UploadResult> => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const res = await axiosClient.post<{ data: UploadResult }>("/admin/storage/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};

export default StorageService;
