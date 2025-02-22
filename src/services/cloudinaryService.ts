import axios from 'axios';

export async function uploadToCloudinary(file: File): Promise<string | undefined> {
  if (!file) return;

  try {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;

    if (!uploadPreset || !cloudinaryUrl) {
      console.error("Cloudinary environment variables are missing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await axios.post(cloudinaryUrl, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
}