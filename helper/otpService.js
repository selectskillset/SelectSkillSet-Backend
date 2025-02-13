import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import otpEmailTemplate from "../templates/otpEmailTemplate.js";

dotenv.config();

// OTP storage (in-memory, replace with Redis in production)
export const otpStorage = {};
// Generate OTP
export const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// Send OTP via email
export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Your OTP Code",
    html: otpEmailTemplate(otp),
  };

  await transporter.sendMail(mailOptions);
};

// Send OTP and store it
export const sendOtp = async (email) => {
    try {
      const otp = generateOtp();
      otpStorage[email] = {
        otp,
        createdAt: Date.now(), // Store the timestamp
      };
      await sendOtpEmail(email, otp);
      console.log(`OTP sent to ${email}: ${otp}`);
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw new Error("Failed to send OTP");
    }
  };

// Verify OTP
export const verifyOtp = (email, otp) => {
   console.log(email, "Verifying OTPnu")
  
    const normalizedEmail = email.toLowerCase();
    console.log(`Verifying OTP for ${normalizedEmail}: ${otp}`);
    const storedData = otpStorage[normalizedEmail];
  
    if (!storedData) {
      console.log(`No OTP found for ${normalizedEmail}`);
      throw new Error("OTP not sent or expired");
    }
  
    const { otp: storedOtp, createdAt } = storedData;
    const currentTime = Date.now();
    const otpExpiryTime = 5 * 60 * 1000;
  
    if (currentTime - createdAt > otpExpiryTime) {
      console.log(`OTP expired for ${normalizedEmail}`);
      delete otpStorage[normalizedEmail];
      throw new Error("OTP expired");
    }
  
    if (storedOtp !== otp) {
      console.log(`Invalid OTP for ${normalizedEmail}. Expected: ${storedOtp}, Received: ${otp}`);
      throw new Error("Invalid OTP");
    }
  
    console.log(`OTP verified successfully for ${normalizedEmail}`);
    delete otpStorage[normalizedEmail];
    return true;
  };