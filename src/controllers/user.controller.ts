import type { NextFunction, Request, Response } from "express";

import {
  deleteUserById,
  getAllUsers,
  updateAvatar,
} from "../services/user.service";
import { AppError } from "../utils/app-error";
import { removeAvatarFile } from "../utils/avatar-file";

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deletedUser = await deleteUserById(Number(req.params.id));
    await removeAvatarFile(deletedUser.avatar).catch(console.error);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const uploadUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    if (!req.file) {
      throw new AppError(400, "Avatar image is required");
    }

    const avatar = `/uploads/${req.file.filename}`;
    const { user, previousAvatar } = await updateAvatar(req.user.id, avatar);
    await removeAvatarFile(previousAvatar).catch(console.error);

    res.status(200).json({ data: user });
  } catch (error) {
    if (req.file) {
      await removeAvatarFile(`/uploads/${req.file.filename}`).catch(console.error);
    }

    next(error);
  }
};
