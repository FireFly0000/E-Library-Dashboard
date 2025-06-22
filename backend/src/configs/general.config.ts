import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config(); // Only load from .env in development
}

export const general = {
  PORT: parseInt((process.env.PORT as string) || "8080"),
  HASH_SALT: parseInt((process.env.HASH_SALT as string) || "10"),
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  TOKEN_ACCESS_EXPIRED_TIME: process.env.TOKEN_ACCESS_EXPIRED_TIME,
  TOKEN_REFRESH_EXPIRED_TIME: process.env.TOKEN_REFRESH_EXPIRED_TIME,
  TOKEN_EMAIL_EXPIRED_TIME: process.env.TOKEN_EMAIL_EXPIRED_TIME,
  DOMAIN_NAME: process.env.DOMAIN_NAME,
  DATABASE_URL: process.env.DATABASE_URL,
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  AWS_S3_BUCKET_REGION: process.env.AWS_S3_BUCKET_REGION,
  EMAIL_SERVER: process.env.EMAIL_SERVER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
