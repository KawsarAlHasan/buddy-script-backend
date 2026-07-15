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

// Get all posts
export const getAllPostService = async (currentUserId: string) => {
  // Build where clause - get PUBLIC posts + user's own PRIVATE posts
  const whereClause = {
    OR: [
      { visibility: "PUBLIC" as const },
      {
        AND: [{ visibility: "PRIVATE" as const }, { authorId: currentUserId }],
      },
    ],
  };

  // Get all posts with relations
  const posts = await dbClient.post.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc", // newest first
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
      comments: {
        select: {
          id: true,
        },
      },
    },
  });

  // Format the response
  const formattedPosts = posts.map((post) => ({
    id: post.id,
    text: post.text,
    imageUrl: post.imageUrl,
    visibility: post.visibility,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: {
      id: post.author.id,
      firstName: post.author.firstName,
      lastName: post.author.lastName,
      email: post.author.email,
    },
    likeCount: post.likes.length,
    commentCount: post.comments.length,
    isLikedByMe: post.likes.some((like) => like.userId === currentUserId),
    isOwn: post.authorId === currentUserId,
  }));

  return formattedPosts;
};

// Get a single post by ID
export const getSinglePostService = async (
  postId: string,
  currentUserId: string,
) => {
  const post = await dbClient.post.findUnique({
    where: { id: postId },
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
      comments: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!post) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Post not found!");
  }

  // Check if user can view this post
  const canView =
    post.visibility === "PUBLIC" || post.authorId === currentUserId;
  if (!canView) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You don't have permission to view this post!",
    );
  }

  return {
    id: post.id,
    text: post.text,
    imageUrl: post.imageUrl,
    visibility: post.visibility,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: {
      id: post.author.id,
      firstName: post.author.firstName,
      lastName: post.author.lastName,
      email: post.author.email,
    },
    likeCount: post.likes.length,
    commentCount: post.comments.length,
    isLikedByMe: post.likes.some((like) => like.userId === currentUserId),
    isOwn: post.authorId === currentUserId,
  };
};

// Update a post
export const updatePostService = async (
  postId: string,
  payload: any,
  currentUserId: string,
) => {
  // Check if post exists and belongs to user
  const existingPost = await dbClient.post.findUnique({
    where: { id: postId },
  });

  if (!existingPost) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Post not found!");
  }

  if (existingPost.authorId !== currentUserId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You don't have permission to update this post!",
    );
  }

  const { text, imageUrl, visibility } = payload;

  const result = await dbClient.post.update({
    where: { id: postId },
    data: {
      text,
      imageUrl,
      visibility,
    },
  });

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
