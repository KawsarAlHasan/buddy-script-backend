import express from "express";
import { createReply, getReplies, deleteReply } from "./reply.controller";
import { userAuth } from "../../middlewares/auth";

const router = express.Router();

// POST /api/comments/:commentId/replies - Create a reply
router.post("/comments/:commentId/replies", userAuth(), createReply);

// GET /api/comments/:commentId/replies - Get all replies for a comment
router.get("/comments/:commentId/replies", userAuth(), getReplies);

// DELETE /api/replies/:replyId - Delete a reply
router.delete("/replies/:replyId", userAuth(), deleteReply);

export const ReplyRoutes = router;
