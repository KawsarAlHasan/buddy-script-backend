import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";
import config from "../../../config";
import { createAuthToken } from "../../../helpers/jwtHelper";

// register service
export const registerService = async (payload: any) => {
  const { firstName, lastName, email, password } = payload;

  // check if email already exists
  const isExistEmail = await dbClient.user.findUnique({
    where: { email },
  });

  // check if email already exists
  if (isExistEmail) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exists!");
  }

  //hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  if (!hashedPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "hashedPassword is required");
  }

  // create user
  const result = await dbClient.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  // check user creation
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to register!");
  }

  //create token
  const createToken = createAuthToken({
    id: result.id,
    email: result.email,
  });

  return { createToken, result };
};

// login service
export const loginService = async (payload: any) => {
  const { email, password } = payload;

  const isExistUser = await dbClient.user.findUnique({
    where: { email },
  });
  if (!isExistUser) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Login failed. Please check your credentials.",
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    isExistUser.password,
  );

  if (!isPasswordMatched) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Login failed. Please check your credentials.",
    );
  }

  //create token
  const createToken = createAuthToken({
    id: isExistUser.id,
    email: isExistUser.email,
  });

  return { createToken, isExistUser };
};
