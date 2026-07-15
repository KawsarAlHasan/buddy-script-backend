import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  createPostService,
  deletePostService,
  getAllPostService,
} from "./post.service";

// create new post
export const createNewPost = catchAsync(async (req: Request, res: Response) => {
  const authorId = (req as any).decodedUser.id;

  const { text, visibility } = req.body;

  let imageUrl = "";

  if (req.files && "image" in req.files && req.files.image[0]) {
    // Build base URL for uploaded file access
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    imageUrl = `${baseUrl}/images/${req.files.image[0].filename}`;
  }

  const payload = {
    text,
    imageUrl,
    visibility,
    authorId,
  };

  const result = await createPostService(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Post created successfully",
    data: result,
  });
});

// get all post
export const getAllPost = catchAsync(async (req: Request, res: Response) => {
  const authorId = (req as any).decodedUser.id;

  const result = await getAllPostService(authorId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Post fetched successfully",
    data: result,
  });
});

// Delete Post
export const deletePost = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const authorId = (req as any).decodedUser.id;

  await deletePostService({ id, authorId });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Post deleted successfully",
  });
});
