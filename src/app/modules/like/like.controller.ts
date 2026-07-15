import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  getPostLikesService,
  likePostService,
  unlikePostService,
  likeCommentService,
  unlikeCommentService,
  getCommentLikesService,
  likeReplyService,
  unlikeReplyService,
  getReplyLikesService,
} from "./like.service";

// ============ POST LIKES CONTROLLERS ============

// like Post controller
export const likePost = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params as { postId: string };
  const userId = (req as any).decodedUser.id;

  const result = await likePostService(postId, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Post liked successfully",
    data: result,
  });
});

// unlike Post controller
export const unlikePost = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params as { postId: string };
  const userId = (req as any).decodedUser.id;

  const result = await unlikePostService(postId, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Post unliked successfully",
    data: result,
  });
});

// get post likes
export const getPostLikes = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params as { postId: string };

  const result = await getPostLikesService(postId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Get post likes successfully",
    data: result,
  });
});

// ============ COMMENT LIKES CONTROLLERS ============

// like Comment controller
export const likeComment = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params as { commentId: string };
  const userId = (req as any).decodedUser.id;

  const result = await likeCommentService(commentId, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Comment liked successfully",
    data: result,
  });
});

// unlike Comment controller
export const unlikeComment = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params as { commentId: string };
  const userId = (req as any).decodedUser.id;

  const result = await unlikeCommentService(commentId, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Comment unliked successfully",
    data: result,
  });
});

// get comment likes
export const getCommentLikes = catchAsync(
  async (req: Request, res: Response) => {
    const { commentId } = req.params as { commentId: string };

    const result = await getCommentLikesService(commentId, req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Get comment likes successfully",
      data: result,
    });
  },
);

// ============ REPLY LIKES CONTROLLERS ============

// like Reply controller
export const likeReply = catchAsync(async (req: Request, res: Response) => {
  const { replyId } = req.params as { replyId: string };
  const userId = (req as any).decodedUser.id;

  const result = await likeReplyService(replyId, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Reply liked successfully",
    data: result,
  });
});

// unlike Reply controller
export const unlikeReply = catchAsync(async (req: Request, res: Response) => {
  const { replyId } = req.params as { replyId: string };
  const userId = (req as any).decodedUser.id;

  const result = await unlikeReplyService(replyId, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Reply unliked successfully",
    data: result,
  });
});

// get reply likes
export const getReplyLikes = catchAsync(async (req: Request, res: Response) => {
  const { replyId } = req.params as { replyId: string };

  const result = await getReplyLikesService(replyId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Get reply likes successfully",
    data: result,
  });
});
