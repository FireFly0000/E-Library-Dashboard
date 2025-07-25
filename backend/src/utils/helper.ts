import { MyJwtPayload } from "../types/decodeToken.type";
import jwt from "jsonwebtoken";
import configs from "../configs/index";
import { setSignUpEmail } from "../configs/nodemailer.config";
import { SendMail } from "../types/sendmail.type";
import { sendMail } from "./sendMail";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../configs/aws.config";
import slugify from "slugify";
import sharp from "sharp";
import redis from "../configs/redis.config";
import { Response } from "express";

export const sendVerificationEmail = async (
  payload: MyJwtPayload
): Promise<Boolean> => {
  // Create a JWT token for email verification
  const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY, {
    expiresIn: configs.general.TOKEN_EMAIL_EXPIRED_TIME,
  });

  // Create a verification link and send the email
  const link = `${configs.general.DOMAIN_NAME}/verify-email/${token}`;
  const html = setSignUpEmail(link);
  const mailOptions: SendMail = {
    from: "E-Lib Share",
    to: `${payload.email}`,
    subject: "E-Lib Share - Verification email",
    text: "You received message from " + payload.email,
    html: html,
  };

  const isSendEmailSuccess = sendMail(mailOptions);
  return isSendEmailSuccess;
};

export function formatAuthorName(name: string): string {
  return name
    .trim()
    .split(/\s+/) // split by spaces
    .map((word) => {
      // Split word by dots (handle initials)
      const segments = word.split(".");

      // Process each segment
      const correctedSegments = segments
        .filter(Boolean) // remove empty segments
        .map((segment) => {
          // Capitalize first letter + lowercase rest
          const capitalized =
            segment[0].toUpperCase() + segment.slice(1).toLowerCase();

          // If it's a single letter initial, ensure a trailing dot
          return capitalized.length === 1 ? capitalized + "." : capitalized;
        });

      // Join with dot
      return correctedSegments.join("");
    })
    .join(" ");
}

export function formatBookTitle(title: string): string {
  const minorWords = new Set([
    "and",
    "or",
    "the",
    "of",
    "in",
    "on",
    "to",
    "a",
    "an",
    "but",
    "for",
    "at",
    "by",
    "with",
  ]);

  const words = title.toLowerCase().trim().split(/\s+/);

  return words
    .map((word, index) => {
      const prevWord = words[index - 1];

      // Capitalize if:
      // - First or last word
      // - Not a minor word
      // - Previous word ends with a colon
      if (
        index === 0 ||
        index === words.length - 1 ||
        !minorWords.has(word) ||
        (prevWord && prevWord.endsWith(":"))
      ) {
        return word[0].toUpperCase() + word.slice(1);
      }

      return word;
    })
    .join(" ");
}

//Helper function to upload file to S3
export const uploadFileToS3 = async (file): Promise<string> => {
  // Generate a unique key for the file using a timestamp and the original filename
  const timestamp = Date.now();
  const uniqueKey = `${timestamp}_${file.originalname}`;
  const allowedImgTypes = ["image/png", "image/jpg", "image/jpeg"];

  let buffer = file.buffer;
  if (allowedImgTypes.includes(file.mimetype)) {
    buffer = await sharp(file.buffer)
      .resize({ height: 1000, width: 676, fit: "contain" })
      .toBuffer();
  }

  const params = {
    Bucket: configs.general.AWS_S3_BUCKET_NAME,
    Key: uniqueKey,
    Body: buffer,
    ContentType: file.mimetype,
  };
  const command = new PutObjectCommand(params);

  try {
    await s3.send(command);
    return uniqueKey;
  } catch (error) {
    console.error("Failed to upload to S3:", error);
    return "";
  }
};

export const getFileUrlFromS3 = async (fileName): Promise<string> => {
  // Check if the URL is already cached in Redis
  const cacheKey = `S3Url_${fileName}`;
  const cachedUrl = await redis.get(cacheKey);
  if (cachedUrl) {
    return cachedUrl;
  }
  const getObjectParams = {
    Bucket: configs.general.AWS_S3_BUCKET_NAME,
    Key: fileName,
  };
  const command = new GetObjectCommand(getObjectParams);
  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 3600, // URL expiration time in seconds (1 hour)
  });

  // Store the signed URL in Redis for 55 minutes
  await redis.set(cacheKey, signedUrl, "EX", 3300);

  return signedUrl;
};

export const generateBookSlug = (title: string, authorName: string): string => {
  const raw = `${title} ${authorName}`;
  return slugify(raw, { lower: true, strict: true });
};

export const parseSearchTitleAndAuthor = (
  input: string
): { title: string; author: string } => {
  const regex = /(.*?)\s+by\s+(.*)/i; // "Title by Author"
  const match = input.match(regex);

  if (match) {
    return {
      title: match[1].trim(),
      author: match[2].trim(),
    };
  }

  return { title: input.trim(), author: "" };
};

//for streaming AI generated text
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
