import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { registerNewUser, userLogin, userProfile } from "./auth.controller";
import { loginZodSchema, registerZodSchema } from "./auth.validation";
import { userAuth } from "../../middlewares/auth";

const router = express.Router();

router.post("/register", validateRequest(registerZodSchema), registerNewUser);
router.post("/login", validateRequest(loginZodSchema), userLogin);
router.get("/profile", userAuth(), userProfile);

export const AuthRoutes = router;
