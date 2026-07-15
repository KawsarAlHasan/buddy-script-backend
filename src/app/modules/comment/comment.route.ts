import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  createComment,
  deleteComment,
  getComments,
} from "./comment.controller";
import { userAuth } from "../../middlewares/auth";
const router = express.Router();

router.post("/posts/:postId", userAuth(), createComment);

router.get("/posts/:postId", userAuth(), getComments);

router.delete("/:commentId", userAuth(), deleteComment);

export const CommentRoutes = router;
