import { unlink } from "node:fs/promises";
import path from "node:path";

export const removeAvatarFile = async (avatarPath: string | null | undefined) => {
  if (!avatarPath?.startsWith("/uploads/avatar-")) {
    return;
  }

  const filename = path.basename(avatarPath);
  const filePath = path.resolve("uploads", filename);

  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
};
