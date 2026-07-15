import express from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { PostRoutes } from "../app/modules/post/post.route";
import { LikeRoutes } from "../app/modules/like/like.route";
import { CommentRoutes } from "../app/modules/comment/comment.route";
import { ReplyRoutes } from "../app/modules/reply/reply.route";

const router = express.Router();

const apiRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/post",
    route: PostRoutes,
  },
  {
    path: "/like",
    route: LikeRoutes,
  },
  {
    path: "/comment",
    route: CommentRoutes,
  },
  {
    path: "/reply",
    route: ReplyRoutes,
  },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
