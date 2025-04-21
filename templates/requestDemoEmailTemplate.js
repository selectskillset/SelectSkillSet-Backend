import dotenv from "dotenv";

dotenv.config();

export const userRequestDemoEmailTemplate = (toEmail, name) => ({
  to: toEmail,
  subject: "Thank You for Requesting a Demo with SELECTSKILLSET",
  html: `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;">
      <!-- Header Section -->
      <div style="background: #0077B5; padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">SELECTSKILLSET</h1>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px 20px; background: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #2d3436; font-size: 20px; margin-bottom: 15px;">Hello ${name},</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          Thank you for requesting a demo with SELECTSKILLSET! Our team will review your request and get back to you shortly.
        </p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          In the meantime, feel free to explore our platform and discover how we can help streamline your hiring process.
        </p>

        <!-- Call-to-Action Button -->
        <a href="${process.env.WEBSITE_URL}" 
           style="background: #0077B5; color: white; padding: 12px 25px; text-decoration: none; 
                  border-radius: 4px; display: inline-block; font-size: 16px; font-weight: bold; text-align: center;">
          Explore Our Platform →
        </a>
      </div>

      <!-- Footer Section -->
      <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #636e72; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; font-size: 14px;">
          This is an automated message. Please do not reply directly.
        </p>
        <p style="margin: 5px 0; font-size: 14px;">
          For any queries, contact us at <a href="mailto:support@selectskillset.com" style="color: #0077B5; text-decoration: none;">support@selectskillset.com</a>.
        </p>
        <p style="margin: 5px 0; font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} SELECTSKILLSET. All rights reserved.
        </p>
      </div>
    </div>
  `,
});

export const adminRequestDemoEmailTemplate = (name, email, company, message) => ({
  to: process.env.SMTP_USER,
  subject: "New Demo Request Received",
  html: `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;">
      <!-- Header Section -->
      <div style="background: #0077B5; padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">SELECTSKILLSET</h1>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px 20px; background: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #2d3436; font-size: 20px; margin-bottom: 15px;">New Demo Request</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          A new demo request has been submitted. Below are the details:
        </p>

        <ul style="padding-left: 20px; margin: 10px 0; color: #555;">
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Company:</strong> ${company}</li>
          <li><strong>Message:</strong> ${message || "No additional message provided."}</li>
        </ul>

        <!-- Call-to-Action Button -->
        <a href="mailto:${email}" 
           style="background: #0077B5; color: white; padding: 12px 25px; text-decoration: none; 
                  border-radius: 4px; display: inline-block; font-size: 16px; font-weight: bold; text-align: center;">
          Contact ${name} →
        </a>
      </div>

      <!-- Footer Section -->
      <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #636e72; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; font-size: 14px;">
          This is an automated message. Please do not reply directly.
        </p>
        <p style="margin: 5px 0; font-size: 14px;">
          For any technical issues, contact <a href="mailto:tech@selectskillset.com" style="color: #0077B5; text-decoration: none;">tech@selectskillset.com</a>.
        </p>
        <p style="margin: 5px 0; font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} SELECTSKILLSET. All rights reserved.
        </p>
      </div>
    </div>
  `,
});