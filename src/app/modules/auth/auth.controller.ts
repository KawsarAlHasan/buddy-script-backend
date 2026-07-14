import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { loginService, registerService } from "./auth.service";

// register new user
export const registerNewUser = catchAsync(
  async (req: Request, res: Response) => {
    const result = await registerService(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Register successfully",
      data: {
        token: result.createToken,
        user: result.result,
      },
    });
  },
);

// user login
export const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await loginService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User login successfully",
    data: {
      token: result.createToken,
      user: result.isExistUser,
    },
  });
});

// get user profile
export const userProfile = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).decodedUser;

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User profile fetched successfully",
    data: user,
  });
});
