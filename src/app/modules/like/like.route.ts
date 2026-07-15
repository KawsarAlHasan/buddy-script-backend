import express from "express";
import {
  likePost,
  unlikePost,
  getPostLikes,
  likeComment,
  unlikeComment,
  getCommentLikes,
  likeReply,
  unlikeReply,
  getReplyLikes,
} from "./like.controller";
import { userAuth } from "../../middlewares/auth";

const router = express.Router();

// ============ POST LIKES ROUTES ============
router.post("/:postId", userAuth(), likePost);
router.post("/unlike/:postId", userAuth(), unlikePost);
router.get("/:postId", getPostLikes);

// ============ COMMENT LIKES ROUTES ============
router.post("/comments/:commentId/like", userAuth(), likeComment);
router.delete("/comments/:commentId/like", userAuth(), unlikeComment);
router.get("/comments/:commentId/likes", userAuth(), getCommentLikes);

// ============ REPLY LIKES ROUTES ============
router.post("/replies/:replyId/like", userAuth(), likeReply);
router.delete("/replies/:replyId/like", userAuth(), unlikeReply);
router.get("/replies/:replyId/likes", userAuth(), getReplyLikes);

export const LikeRoutes = router;
