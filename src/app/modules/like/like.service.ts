import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";
import { StatusCodes } from "http-status-codes";

// ============ POST LIKES ============

// Like a post
export const likePostService = async (postId: string, userId: string) => {
  // Check if post exists
  const post = await dbClient.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Post not found!");
  }

  // Check if already liked
  const existingLike = await dbClient.postLike.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existingLike) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "You already liked this post!");
  }

  // Create like
  await dbClient.postLike.create({
    data: {
      userId,
      postId,
    },
  });

  return { message: "Post liked successfully!" };
};

// Unlike a post
export const unlikePostService = async (postId: string, userId: string) => {
  // Check if like exists
  const like = await dbClient.postLike.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (!like) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "You haven't liked this post!");
  }

  // Delete like
  await dbClient.postLike.delete({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  return { message: "Post unliked successfully!" };
};

// Get users who liked a post (with pagination)
export const getPostLikesService = async (postId: string, query: any) => {
  const { page = 1, limit = 10 } = query;

  // Check if post exists
  const post = await dbClient.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Post not found!");
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Get total likes count
  const total = await dbClient.postLike.count({
    where: { postId },
  });

  // Get likes with user info
  const likes = await dbClient.postLike.findMany({
    where: { postId },
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  const users = likes.map((like) => ({
    id: like.user.id,
    firstName: like.user.firstName,
    lastName: like.user.lastName,
    email: like.user.email,
  }));

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ============ COMMENT LIKES ============
export const likeCommentService = async (commentId: string, userId: string) => {
  // Check if comment exists
  const comment = await dbClient.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found!");
  }

  // Check if already liked
  const existingLike = await dbClient.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  if (existingLike) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You already liked this comment!",
    );
  }

  await dbClient.commentLike.create({
    data: {
      userId,
      commentId,
    },
  });

  return { message: "Comment liked successfully!" };
};

export const unlikeCommentService = async (
  commentId: string,
  userId: string,
) => {
  const like = await dbClient.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  if (!like) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You haven't liked this comment!",
    );
  }

  await dbClient.commentLike.delete({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  return { message: "Comment unliked successfully!" };
};

export const getCommentLikesService = async (commentId: string, query: any) => {
  const { page = 1, limit = 10 } = query;

  const comment = await dbClient.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found!");
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const total = await dbClient.commentLike.count({
    where: { commentId },
  });

  const likes = await dbClient.commentLike.findMany({
    where: { commentId },
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  const users = likes.map((like) => ({
    id: like.user.id,
    firstName: like.user.firstName,
    lastName: like.user.lastName,
    email: like.user.email,
  }));

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ============ REPLY LIKES SERVICES ============

// Like a reply
export const likeReplyService = async (replyId: string, userId: string) => {
  const reply = await dbClient.reply.findUnique({
    where: { id: replyId },
  });

  if (!reply) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Reply not found!");
  }

  const existingLike = await dbClient.replyLike.findUnique({
    where: {
      userId_replyId: {
        userId,
        replyId,
      },
    },
  });

  if (existingLike) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You already liked this reply!",
    );
  }

  const result = await dbClient.replyLike.create({
    data: {
      userId,
      replyId,
    },
  });

  return result;
};

// Unlike a reply
export const unlikeReplyService = async (replyId: string, userId: string) => {
  const like = await dbClient.replyLike.findUnique({
    where: {
      userId_replyId: {
        userId,
        replyId,
      },
    },
  });

  if (!like) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You haven't liked this reply!",
    );
  }

  await dbClient.replyLike.delete({
    where: {
      userId_replyId: {
        userId,
        replyId,
      },
    },
  });

  return { message: "Reply unliked successfully!" };
};

// Get users who liked a reply
export const getReplyLikesService = async (replyId: string, query: any) => {
  const { page = 1, limit = 10 } = query;

  const reply = await dbClient.reply.findUnique({
    where: { id: replyId },
  });

  if (!reply) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Reply not found!");
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const total = await dbClient.replyLike.count({
    where: { replyId },
  });

  const likes = await dbClient.replyLike.findMany({
    where: { replyId },
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  const users = likes.map((like) => ({
    id: like.user.id,
    firstName: like.user.firstName,
    lastName: like.user.lastName,
    email: like.user.email,
  }));

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};
