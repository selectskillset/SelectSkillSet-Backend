export const bookmarkEmailTemplate = (toEmail, candidateName, companyName) => ({
  to: toEmail,
  subject: `🎉 ${companyName} Has Bookmarked Your Profile on SELECTSKILLSET!`,
  html: `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;">
      <!-- Header Section -->
      <div style="background: #0077B5; padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; position: relative;">
        <!-- Transparent Banner Image -->
        <img src="https://www.wsioms.co.za/wp-content/uploads/2022/08/Indexing.png" alt="SELECTSKILLSET Banner" 
             style="width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px;" />
        <h1 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin: 0; font-size: 24px; font-weight: bold; color: white;">
          SELECTSKILLSET
        </h1>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px 20px; background: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #2d3436; font-size: 20px; margin-bottom: 15px;">Hello ${candidateName},</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          We have exciting news for you! <strong>${companyName}</strong> has bookmarked your profile on 
          <strong>SELECTSKILLSET</strong>. This means they are interested in your skills and may reach out 
          soon with potential opportunities.
        </p>

        <!-- Suspense Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #0077B5; font-size: 18px;">What’s Next?</h3>
          <ul style="padding-left: 20px; margin: 10px 0; color: #555;">
            <li>Keep your profile updated to stay ahead.</li>
            <li>Stay tuned for communication from ${companyName}.</li>
            <li>Explore more opportunities on <a href="${
              process.env.WEBSITE_URL
            }" style="color: #0077B5; text-decoration: none;">SELECTSKILLSET</a>.</li>
          </ul>
        </div>

        <!-- Call-to-Action Button -->
        <a href="${process.env.WEBSITE_URL}" 
           style="background: #0077B5; color: white; padding: 12px 25px; text-decoration: none; 
                  border-radius: 4px; display: inline-block; font-size: 16px; font-weight: bold; text-align: center;">
          View Your Profile Now →
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