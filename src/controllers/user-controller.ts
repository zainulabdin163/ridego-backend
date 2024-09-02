import { Response, Request, NextFunction } from "express";
import { AppError, CatchAsync } from "../utils";
import { updateOne, deleteOne, getOne, getAll } from "./handler-factory";
import User from "../models/user-model";

const filterObj = <T extends Record<string, any>>(
  obj: T,
  ...allowedFields: (keyof T)[]
): Partial<T> => {
  const newObj: Partial<T> = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el as keyof T)) {
      newObj[el as keyof T] = obj[el];
    }
  });

  return newObj;
};

const getMe = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) req.params.id = req.user.id;

  next();
};

const updateMe = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for Password updates. Please use /updateMyPassword",
          400
        )
      );
    }

    const filteredBody = filterObj(req.body, "name", "email");

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

const deleteMe = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user?.id, { active: false });
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

const updateUser = updateOne(User);
const deleteUser = deleteOne(User);
const getUser = getOne(User);
const getAllUsers = getAll(User);

export {
  getMe,
  updateMe,
  deleteMe,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
};
