import nodemailer from "nodemailer";
import { CatchAsync } from "./catch-async";

export type EmailOptions = {
  email: string;
  subject: string;
  message: string;
};

const sendEmail = async ({ email, subject, message }: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 0,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Zain Shaikh <hello@zainshaikh.io>",
    to: email,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

export { sendEmail };
