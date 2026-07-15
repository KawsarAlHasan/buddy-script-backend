import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  createCommentService,
  deleteCommentService,
  getCommentsService,
} from "./comment.service";

// create Comment
export const createComment = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params as { postId: string };
  const { content } = req.body;
  const userId = (req as any).decodedUser.id;

  const comment = await createCommentService(postId, content, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Signup successfully",
    data: comment,
  });
});

// getComments
export const getComments = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params as { postId: string };
  const userId = (req as any).decodedUser.id;

  const result = await getCommentsService(postId, req.query, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Signup successfully",
    data: result,
  });
});

// deleteComment
export const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params as { commentId: string };
  const userId = (req as any).decodedUser.id;

  const result = await deleteCommentService(commentId, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Signup successfully",
    data: result,
  });
});
