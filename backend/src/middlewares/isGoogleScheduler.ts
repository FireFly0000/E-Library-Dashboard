// middlewares/isGoogleScheduler.ts
import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

export const isGoogleScheduler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Missing token" });
    return;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLOUD_RUN_URL,
    });

    const payload = ticket.getPayload();
    if (
      //payload.email?.endsWith("@gserviceaccount.com") &&
      payload.email_verified
    ) {
      next();
      return;
    } else {
      res.status(403).json({ message: "Unauthorized caller" });
      return;
    }
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
