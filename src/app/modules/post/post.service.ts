import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";

// create post
export const createPostService = async (payload: any) => {
  const { text, imageUrl, visibility, authorId } = payload;

  // create post
  const result = await dbClient.post.create({
    data: {
      text,
      imageUrl,
      visibility,
      authorId,
    },
  });

  // check post creation
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create post!");
  }

  return result;
};

// Delete post
export const deletePostService = async ({
  id,
  authorId,
}: {
  id: string;
  authorId: string;
}) => {
  // check Post exist
  const isExistPost = await dbClient.post.findUnique({
    where: { id: id, authorId: authorId },
  });
  if (!isExistPost) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Post doesn't exist!");
  }

  // delete Post
  const result = await dbClient.post.delete({
    where: { id: id },
  });

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete post!");
  }

  return result;
};
