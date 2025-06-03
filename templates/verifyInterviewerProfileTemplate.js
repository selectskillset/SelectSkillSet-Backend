const getVerifyTemplate = (interviewerName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile Verified - SelectSkillSet</title>
  <style type="text/css">
    body, html {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #4a5568;
      background-color: #f8fafc;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .email-header {
      padding: 24px;
      text-align: center;
    }

    .email-header img {
      width: 150px;
      height: auto;
    }

    .email-content {
      padding: 32px;
    }

    .email-title {
      color: #1d1d1f;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .email-text {
      color: #4a5568;
      font-size: 16px;
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .highlight-box {
      background-color: #e8f4fd;
      border-left: 4px solid #4338CA;
      padding: 16px;
      margin: 24px 0;
      border-radius: 0 4px 4px 0;
    }

    .benefits-list {
      margin: 20px 0;
      padding-left: 20px;
    }

    .benefits-list li {
      margin-bottom: 8px;
    }

    .action-button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(90deg, #4338CA, #7C3AED);
      color: white !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      text-align: center;
    }

    .email-footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #718096;
    }

    @media only screen and (max-width: 600px) {
      .email-content {
        padding: 24px;
      }

      .email-title {
        font-size: 18px;
      }

      .email-text {
        font-size: 14px;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 20px; background-color: #f8fafc;">
  <div class="email-container">
    <div class="email-header">
      <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo">
    </div>
    <div class="email-content">
      <h2 class="email-title">Congratulations, ${interviewerName}!</h2>
      <p class="email-text">Your SELECTSKILLSET interviewer profile has been successfully verified.</p>

      <div class="highlight-box">
        <p style="margin: 0;">This verification badge enhances your credibility and helps candidates trust your expertise.</p>
      </div>

      <p class="email-text">You can now:</p>
      <ul class="benefits-list">
        <li>Appear higher in search results and recommendations</li>
        <li>Receive more interview requests from qualified candidates</li>
        <li>Build your professional reputation in our network</li>
        <li>Access exclusive verified interviewer features</li>
      </ul>

      <div style="text-align: center;">
        <a href="${process.env.WEBSITE_URL}/interviewer-login" class="action-button">Go to Your Dashboard</a>
      </div>

      <div class="email-footer">
        <p>© SelectSkillSet. All rights reserved.</p>
       
      </div>
    </div>
  </div>
</body>
</html>
`;
};

const getUnverifyTemplate = (interviewerName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile Verification Update - SelectSkillSet</title>
  <style type="text/css">
    body, html {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #4a5568;
      background-color: #f8fafc;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .email-header {
      padding: 24px;
      text-align: center;
    }

    .email-header img {
      width: 150px;
      height: auto;
    }

    .email-content {
      padding: 32px;
    }

    .email-title {
      color: #1d1d1f;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .email-text {
      color: #4a5568;
      font-size: 16px;
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .alert-box {
      background-color: #fde8e8;
      border-left: 4px solid #d93025;
      padding: 16px;
      margin: 24px 0;
      border-radius: 0 4px 4px 0;
    }

    .steps-list {
      margin: 20px 0;
      padding-left: 20px;
    }

    .steps-list li {
      margin-bottom: 12px;
    }

    .action-button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(90deg, #4338CA, #7C3AED);
      color: white !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      text-align: center;
    }

    .email-footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #718096;
    }

    @media only screen and (max-width: 600px) {
      .email-content {
        padding: 24px;
      }

      .email-title {
        font-size: 18px;
      }

      .email-text {
        font-size: 14px;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 20px; background-color: #f8fafc;">
  <div class="email-container">
    <div class="email-header">
      <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo">
    </div>
    <div class="email-content">
      <h2 class="email-title">Profile Verification Update</h2>
      <p class="email-text">Dear ${interviewerName},</p>
      <p class="email-text">The verification status has been removed from your SELECTSKILLSET interviewer profile.</p>

      <div class="alert-box">
        <p style="margin: 0;">Your profile no longer displays the verification badge, which may affect your visibility to candidates.</p>
      </div>

      <p class="email-text">To regain verified status:</p>
      <ol class="steps-list">
        <li>Review and update your profile information for completeness and accuracy</li>
        <li>Verify your professional credentials and work history</li>
        <li>Ensure your profile meets all our verification requirements</li>
        <li>Contact our support team if you believe this change was made in error</li>
      </ol>

      <div style="text-align: center;">
        <a href="${process.env.WEBSITE_URL}/interviewer-login" class="action-button">Update Your Profile</a>
      </div>

      <p class="email-text">Our support team is available to help you through this process if needed.</p>

      <div class="email-footer">
        <p>For assistance, please contact our support team at <a href="mailto:support@selectskillset.com" style="color: #718096; text-decoration: underline;">support@selectskillset.com</a></p>
        <p>©  SelectSkillSet. All rights reserved.</p>
        
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export { getVerifyTemplate, getUnverifyTemplate };
