import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { AppError } from "../utils/app-error";

const allowedInputFormats = new Set(["jpeg", "png", "webp"]);
const maxInputPixels = 25_000_000;
const avatarSize = 512;

export const processAvatar = async (input: Buffer): Promise<string> => {
  let metadata: sharp.Metadata;

  try {
    metadata = await sharp(input, { limitInputPixels: maxInputPixels }).metadata();
  } catch {
    throw new AppError(400, "The uploaded file is not a valid image");
  }

  if (!metadata.format || !allowedInputFormats.has(metadata.format)) {
    throw new AppError(400, "Avatar must be a JPEG, PNG, or WebP image");
  }

  if (!metadata.width || !metadata.height) {
    throw new AppError(400, "The uploaded image has invalid dimensions");
  }

  if ((metadata.pages ?? 1) > 1) {
    throw new AppError(400, "Animated images are not allowed");
  }

  let output: Buffer;

  try {
    output = await sharp(input, { limitInputPixels: maxInputPixels })
      .rotate()
      .resize(avatarSize, avatarSize, {
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
  } catch {
    throw new AppError(400, "The uploaded image could not be processed");
  }

  const filename = `avatar-${randomUUID()}.webp`;
  const uploadsDirectory = path.resolve("uploads");

  await mkdir(uploadsDirectory, { recursive: true });
  await writeFile(path.join(uploadsDirectory, filename), output, {
    flag: "wx",
  });

  return `/uploads/${filename}`;
};
