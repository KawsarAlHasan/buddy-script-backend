import express from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { PostRoutes } from "../app/modules/post/post.route";

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
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
