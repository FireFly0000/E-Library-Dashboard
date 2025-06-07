import { SendMail } from "types/sendmail.type";
import { transporter } from "../configs/nodemailer.config";

export const sendMail = (mailOptions: SendMail) => {
  transporter.sendMail(mailOptions, function (err) {
    if (err) {
      return false;
    }
  });
  return true;
};
