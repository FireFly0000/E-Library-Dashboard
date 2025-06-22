import { MyJwtPayload } from "../types/decodeToken.type";
import jwt from "jsonwebtoken";
import configs from "../configs/index";
import { setSignUpEmail } from "../configs/nodemailer.config";
import { SendMail } from "../types/sendmail.type";
import { sendMail } from "./sendMail";

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
    .split(/\s+/) // Split by one or more spaces
    .map((word) =>
      word
        .split(".")
        .map((segment) =>
          segment
            ? segment[0].toUpperCase() + segment.slice(1).toLowerCase()
            : ""
        )
        .join(".")
    )
    .join(" ");
}
