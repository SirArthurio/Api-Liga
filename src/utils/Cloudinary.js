import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImg = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "LigaCesar",
    });
    return result;
  } catch (error) {
    console.error("Error al subir la imagen a Cloudinary:", error);
    throw error;
  }
};

export async function deleteImg(publicId) {
  return await cloudinary.uploader.upload.destroy(publicId);
}
