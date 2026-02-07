import { betterAuth } from "better-auth";
import { Pool } from "@neondatabase/serverless";
import { emailOTP } from "better-auth/plugins";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }: { email: string; otp: string; type: "sign-in" | "email-verification" | "forget-password" }) {
                await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: type === "sign-in" ? "Your Login OTP" : "Your OTP Verification Code",
                    text: `Your One-Time Password (OTP) is: ${otp}. It will expire in 5 minutes.`,
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #4F46E5; text-align: center;">Voiceless Authentication</h2>
              <p style="font-size: 16px; color: #333;">Hello,</p>
              <p style="font-size: 16px; color: #333;">Your One-Time Password (OTP) for verification is:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; background-color: #F3F4F6; padding: 10px 20px; border-radius: 5px;">${otp}</span>
              </div>
              <p style="font-size: 14px; color: #666;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} Voiceless. All rights reserved.</p>
            </div>
          `,
                });
            },
        }),
    ],
});
