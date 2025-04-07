import crypto from "crypto";
import bcrypt from "bcrypt"
import PasswordReset from "../model/PasswordReset.js";
import { sendEmail } from "../helper/emailService.js";
import { Candidate } from "../model/candidateModel.js";
import { Interviewer } from "../model/interviewerModel.js";
import { Corporate } from "../model/corporateModel.js";
import { Admin } from "../model/adminModel.js";
import { passwordResetTemplate } from "../templates/passwordResetTemplate.js";
import { passwordChangedTemplate } from "../templates/passwordChangedTemplate.js";

const websiteUrl = process.env.WEBSITE_URL;

const UserModels = {
  Candidate,
  Interviewer,
  Corporate,
  Admin,
};

const findUserByEmail = async (email) => {
  const models = Object.entries(UserModels);
  for (const [modelName, model] of models) {
    const user = await model.findOne({ email });
    if (user) return { user, modelName };
  }
  return null;
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await findUserByEmail(email);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No account with that email found",
      });
    }

    const { user, modelName } = result;

    // Check existing reset attempts
    const existingAttempts = await PasswordReset.countDocuments({
      email,
      userType: modelName,
    });

    if (existingAttempts >= 2) {
      return res.status(400).json({
        success: false,
        message: "Password reset limit exceeded (max 2 attempts)",
      });
    }

    // Generate and store token
    const token = crypto.randomBytes(20).toString("hex");
    await PasswordReset.create({
      email,
      userType: modelName,
      token,
      attempts: existingAttempts + 1,
    });

    // Send email
    const resetUrl = `${websiteUrl}/reset-password/${token}`;
    const emailHtml = passwordResetTemplate({
      name: user.name || "User",
      resetUrl,
    });

    await sendEmail(
      email,
      "Password Reset Request",
      `Password Reset Link: ${resetUrl}`,
      emailHtml
    );

    res.json({
      success: true,
      message: "Reset link sent to registered email",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find valid token
    const resetEntry = await PasswordReset.findOne({
      token,
      expiresAt: { $gt: Date.now() },
    });

    if (!resetEntry) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Find user
    const Model = UserModels[resetEntry.userType];
    const user = await Model.findOne({ email: resetEntry.email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete all reset entries for this user
    await PasswordReset.deleteMany({
      email: resetEntry.email,
      userType: resetEntry.userType,
    });

    // Send confirmation email
    const emailHtml = passwordChangedTemplate({
      name: user.name || "User",
    });

    await sendEmail(
      user.email,
      "Password Updated Successfully",
      "Your password has been successfully updated",
      emailHtml
    );

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
