import { StatusCodes } from "http-status-codes";
import { dbClient } from "../../../lib/prisma";
import ApiError from "../../../errors/ApiError";

// Create a reply
export const createReplyService = async (
  commentId: string,
  content: string,
  userId: string,
) => {
  // Check if comment exists
  const comment = await dbClient.comment.findUnique({
    where: { id: commentId },
    include: {
      post: true,
    },
  });

  if (!comment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found!");
  }

  // Check if user can view the post
  const canView =
    comment.post.visibility === "PUBLIC" || comment.post.authorId === userId;
  if (!canView) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You don't have permission to reply to this comment!",
    );
  }

  // Create reply
  const reply = await dbClient.reply.create({
    data: {
      content,
      commentId,
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
    id: reply.id,
    content: reply.content,
    createdAt: reply.createdAt,
    author: {
      id: reply.author.id,
      firstName: reply.author.firstName,
      lastName: reply.author.lastName,
      email: reply.author.email,
    },
  };
};

// Get replies for a comment (with pagination)
export const getRepliesService = async (
  commentId: string,
  query: any,
  userId: string,
) => {
  const { page = 1, limit = 10 } = query;

  const comment = await dbClient.comment.findUnique({
    where: { id: commentId },
    include: {
      post: true,
    },
  });

  if (!comment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found!");
  }

  const canView =
    comment.post.visibility === "PUBLIC" || comment.post.authorId === userId;
  if (!canView) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You don't have permission to view replies!",
    );
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const total = await dbClient.reply.count({
    where: { commentId },
  });

  const replies = await dbClient.reply.findMany({
    where: { commentId },
    skip,
    take,
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
    },
  });

  const formattedReplies = replies.map((reply) => ({
    id: reply.id,
    content: reply.content,
    createdAt: reply.createdAt,
    author: {
      id: reply.author.id,
      firstName: reply.author.firstName,
      lastName: reply.author.lastName,
      email: reply.author.email,
    },
    likeCount: reply.likes.length,
    isLikedByMe: reply.likes.some((like) => like.userId === userId),
  }));

  return {
    replies: formattedReplies,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// Delete a reply
export const deleteReplyService = async (replyId: string, userId: string) => {
  const reply = await dbClient.reply.findUnique({
    where: { id: replyId },
  });

  if (!reply) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Reply not found!");
  }

  if (reply.authorId !== userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You don't have permission to delete this reply!",
    );
  }

  await dbClient.reply.delete({
    where: { id: replyId },
  });

  return { message: "Reply deleted successfully!" };
};
