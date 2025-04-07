import express from "express";
import { forgotPassword, resetPassword } from "../controller/authController.js";
const authRoutes = express.Router();

authRoutes.post("/forgotpassword", forgotPassword);
authRoutes.post("/resetpassword/:token", resetPassword);

export default authRoutes;
