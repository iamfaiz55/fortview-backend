import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"
dotenv.config()
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// export const uploadToCloudinary = async (buffer: Buffer, folder: string): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     console.log("buffer, ", buffer,"folder", folder );
    
//     cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'auto',
//         folder: `fortview/${folder}`,
//         transformation: [
//           { width: 1200, height: 800, crop: 'limit' },
//           { quality: 'auto' },
//           { format: 'auto' },
//         ],
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     ).end(buffer);
//   });
// };
export const uploadToCloudinary = async (buffer: Buffer, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    console.log("Uploading buffer of length:", buffer.length, "to folder:", folder);

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: `fortview/${folder}`,
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          console.log("Cloudinary upload result:", result);
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
};


export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  return cloudinary.uploader.destroy(publicId);
};