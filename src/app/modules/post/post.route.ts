import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createNewPost, deletePost, getAllPost } from "./post.controller";
import { postZodSchema } from "./post.validation";
import { userAuth } from "../../middlewares/auth";
import fileUploadHandler from "../../middlewares/fileUploadHandler";

const router = express.Router();

router.post(
  "/create",
  userAuth(),
  // validateRequest(postZodSchema),
  fileUploadHandler(),
  createNewPost,
);

router.get("/", userAuth(), getAllPost);

router.delete("/:id", userAuth(), deletePost);

export const PostRoutes = router;
