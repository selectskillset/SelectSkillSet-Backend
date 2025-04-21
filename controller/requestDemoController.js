import { sendEmail } from "../helper/emailService.js";
import { RequestDemo } from "../model/requestDemoModel.js";
import {
  adminRequestDemoEmailTemplate,
  userRequestDemoEmailTemplate,
} from "../templates/requestDemoEmailTemplate.js";

export const requestDemo = async (req, res) => {
  try {
    const { name, email, company, message } = req.body;

    const newRequest = new RequestDemo({ name, email, company, message });
    await newRequest.save();

    // Send email to the user
    await sendEmail(
      email,
      "Thank You for Requesting a Demo with SELECTSKILLSET",
      null,
      userRequestDemoEmailTemplate(email, name).html
    );

    // Send email to the admin
    await sendEmail(
      process.env.SMTP_USER,
      "New Demo Request Received",
      null,
      adminRequestDemoEmailTemplate(name, email, company, message).html
    );

    return res.status(200).json({
      success: true,
      message: "Demo request submitted successfully!",
    });
  } catch (error) {
    console.error("Error submitting demo request:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};
