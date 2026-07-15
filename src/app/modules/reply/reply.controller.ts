import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  createReplyService,
  getRepliesService,
  deleteReplyService,
} from "./reply.service";

// Create a reply
export const createReply = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params as { commentId: string };
  const { content } = req.body;
  const userId = (req as any).decodedUser.id;

  const result = await createReplyService(commentId, content, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Reply created successfully",
    data: result,
  });
});

// Get replies for a comment
export const getReplies = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params as { commentId: string };
  const userId = (req as any).decodedUser.id;

  const result = await getRepliesService(commentId, req.query, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Replies retrieved successfully",
    data: result,
  });
});

// Delete a reply
export const deleteReply = catchAsync(async (req: Request, res: Response) => {
  const { replyId } = req.params as { replyId: string };
  const userId = (req as any).decodedUser.id;

  const result = await deleteReplyService(replyId, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Reply deleted successfully",
    data: result,
  });
});
