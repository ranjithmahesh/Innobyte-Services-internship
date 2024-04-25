import express from "express";
import {
  UserInfo,
  VerifyEmail,
  deleteUser,
  login,
  otpVerify,
  register,
  updateUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.get("/otp", otpVerify);
router.post("/login", login);
router.post("/user/update", updateUser);
router.get("/verify/:token", VerifyEmail);
router.get("/user", UserInfo);
router.delete("/user", deleteUser);

export default router;
