import express from "express";
import {
  forgotPassword,
  resetPassword,
  protectRoute,
  signIn,
  signUp,
  updatePassword,
  restrictTo,
} from "../controllers/auth-controller";
import {
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
  updateUser,
} from "../controllers/user-controller";
import { Roles } from "../models/userModel";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

router.use(protectRoute);

router.patch("/update-my-password", updatePassword);
router.patch("/update-me", updateMe);
router.delete("/delete-me", deleteMe);

router.use(restrictTo(Roles.Admin));

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
