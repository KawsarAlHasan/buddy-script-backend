import { StatusCodes } from "http-status-codes";
import { dbClient } from "../../../lib/prisma";
import ApiError from "../../../errors/ApiError";

// Create a comment
export const createCommentService = async (
  postId: string,
  content: string,
  userId: string,
) => {
  // Check if post exists
  const post = await dbClient.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Post not found!");
  }

  // Check if user can view this post
  const canView = post.visibility === "PUBLIC" || post.authorId === userId;
  if (!canView) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You don't have permission to comment on this post!",
    );
  }

  // Create comment
  const comment = await dbClient.comment.create({
    data: {
      content,
      postId,
      authorId: userId,
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    author: {
      id: comment.author.id,
      firstName: comment.author.firstName,
      lastName: comment.author.lastName,
      email: comment.author.email,
    },
  };
};

// Get comments for a post (with pagination)
export const getCommentsService = async (
  postId: string,
  query: any,
  userId: string,
) => {
  // Check if post exists
  const post = await dbClient.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Post not found!");
  }

  // Check if user can view this post
  const canView = post.visibility === "PUBLIC" || post.authorId === userId;
  if (!canView) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You don't have permission to view comments on this post!",
    );
  }

  // Get comments
  const comments = await dbClient.comment.findMany({
    where: { postId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      likes: {
        select: {
          userId: true,
        },
      },
      replies: {
        select: {
          id: true,
        },
      },
    },
  });

  const formattedComments = comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    author: {
      id: comment.author.id,
      firstName: comment.author.firstName,
      lastName: comment.author.lastName,
      email: comment.author.email,
    },
    likeCount: comment.likes.length,
    replyCount: comment.replies.length,
    isLikedByMe: comment.likes.some((like) => like.userId === userId),
  }));

  return formattedComments;
};

// Delete a comment
export const deleteCommentService = async (
  commentId: string,
  userId: string,
) => {
  // Check if comment exists
  const comment = await dbClient.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found!");
  }

  // Check if user is the author
  if (comment.authorId !== userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You don't have permission to delete this comment!",
    );
  }

  // Delete comment (cascade will delete replies and likes)
  await dbClient.comment.delete({
    where: { id: commentId },
  });

  return { message: "Comment deleted successfully!" };
};
