import dotenv from "dotenv";

dotenv.config();

export const userRequestDemoEmailTemplate = (toEmail, name) => ({
  to: toEmail,
  subject: "Thank You for Requesting a Demo with SELECTSKILLSET",
  html: `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #4a5568;">
      <!-- Header Section -->
      <div style="padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo" style="width: 150px; height: auto;">
      </div>

      <!-- Main Content -->
      <div style="padding: 30px 20px; background: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #4338CA; font-size: 20px; margin-bottom: 15px;">Hello ${name},</h2>

        <p style="font-size: 16px; margin-bottom: 20px;">
          Thank you for requesting a demo with SELECTSKILLSET! Our team will review your request and get back to you shortly.
        </p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          In the meantime, feel free to explore our platform and discover how we can help streamline your hiring process.
        </p>

        <!-- Call-to-Action Button -->
        <div style="text-align: center;">
          <a href="${process.env.WEBSITE_URL}"
             style="background: linear-gradient(90deg, #4338CA, #7C3AED); color: white; padding: 12px 25px; text-decoration: none;
             border-radius: 4px; display: inline-block; font-size: 16px; font-weight: bold; text-align: center;">
            Explore Our Platform →
          </a>
        </div>
      </div>

      <!-- Footer Section -->
      <div style="background: #f8fafc; padding: 20px; text-align: center; color: #718096; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; font-size: 14px;">
          This is an automated message. Please do not reply directly.
        </p>
        
        <p style="margin: 5px 0; font-size: 12px; color: #999;">
          ©  SELECTSKILLSET. All rights reserved.
        </p>
      </div>
    </div>
  `,
});

export const adminRequestDemoEmailTemplate = (
  name,
  email,
  company,
  message
) => ({
  to: process.env.SMTP_USER,
  subject: "New Demo Request Received",
  html: `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #4a5568;">
      <!-- Header Section -->
      <div style=" padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo" style="width: 150px; height: auto;">
      </div>

      <!-- Main Content -->
      <div style="padding: 30px 20px; background: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #4338CA; font-size: 20px; margin-bottom: 15px;">New Demo Request</h2>

        <p style="font-size: 16px; margin-bottom: 20px;">
          A new demo request has been submitted. Below are the details:
        </p>

        <ul style="padding-left: 20px; margin: 10px 0; color: #4a5568;">
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Company:</strong> ${company}</li>
          <li><strong>Message:</strong> ${
            message || "No additional message provided."
          }</li>
        </ul>

        <!-- Call-to-Action Button -->
        <div style="text-align: center;">
          <a href="mailto:${email}"
             style="background: linear-gradient(90deg, #4338CA, #7C3AED); color: white; padding: 12px 25px; text-decoration: none;
             border-radius: 4px; display: inline-block; font-size: 16px; font-weight: bold; text-align: center;">
            Contact ${name} →
          </a>
        </div>
      </div>

      <!-- Footer Section -->
      <div style="background: #f8fafc; padding: 20px; text-align: center; color: #718096; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; font-size: 14px;">
          This is an automated message. Please do not reply directly.
        </p>
        
        <p style="margin: 5px 0; font-size: 12px; color: #999;">
          ©  SELECTSKILLSET. All rights reserved.
        </p>
      </div>
    </div>
  `,
});
