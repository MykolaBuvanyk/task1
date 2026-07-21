import path from "node:path";

import multer from "multer";

import { AppError } from "../utils/app-error";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      !allowedMimeTypes.has(file.mimetype.toLowerCase()) ||
      !allowedExtensions.has(extension)
    ) {
      callback(
        new AppError(400, "Avatar must be a JPEG, PNG, or WebP image"),
      );
      return;
    }

    callback(null, true);
  },
});
