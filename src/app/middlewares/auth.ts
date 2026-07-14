import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import { verifyAuthToken } from "../../helpers/jwtHelper";
import { dbClient } from "../../lib/prisma";

// verify user
export const userAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.authorization?.split(" ")?.[1];
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      const decoded = verifyAuthToken(token);

      // get user from db
      const user = await dbClient.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "No user found. Please login again",
        );
      }

      (req as any).decodedUser = user;
      next();
    } catch (error: any) {
      next(error);
    }
  };
};
