import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  user_jwt_secret: process.env.USER_JWT_SECRET,
  jwt_expire_in: process.env.JWT_EXPIRE_IN,

  ip_address: process.env.IP_ADDRESS,
  node_env: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
};
