// middlewares/uploadImage.ts
import { Request, Response, NextFunction } from "express";
import cloudinary from "@/config/cloudinary";

export const uploadImageToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(req as any).file)
    return res.status(400).json({ message: "No file provided" });

  try {
    const result = await cloudinary.uploader.upload_stream(
      { folder: "tracknfix_images" },
      (error, result) => {
        if (error || !result)
          return res.status(500).json({ message: "Cloudinary error", error });

        // Attach uploaded file URL to req
        (req as any).cloudinaryUrl = result.secure_url;
        next();
      }
    );

    // Stream file buffer to Cloudinary
    const stream = result;
    stream.end((req as any).file.buffer);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error uploading to Cloudinary", err });
  }
};
