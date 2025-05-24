import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config(); // Only load from .env in development
}

export const general = {
  DATABASE_URL: process.env.DATABASE_URL,
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  AWS_S3_BUCKET_REGION: process.env.AWS_S3_BUCKET_REGION,
};
