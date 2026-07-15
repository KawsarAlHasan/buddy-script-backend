import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config/index";

type payload = {
  id: string;
  email: string;
};

// create token
export const createAuthToken = (payload: payload) => {
  const secret = config.user_jwt_secret;

  return jwt.sign(payload, secret as string, {
    expiresIn: "60days",
  });
};

// verify token
export const verifyAuthToken = (token: string) => {
  const secret = config.user_jwt_secret;

  return jwt.verify(token, secret as Secret) as JwtPayload;
};
