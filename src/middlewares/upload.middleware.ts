import path from "node:path";

import multer from "multer";

import { AppError } from "../utils/app-error";

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, path.resolve("uploads"));
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new AppError(400, "Only image files are allowed"));
      return;
    }

    callback(null, true);
  },
});
