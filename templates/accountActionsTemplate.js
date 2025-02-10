export const suspendAccountTemplate = (name, reason) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Suspension Notice</title>
  <style>
    :root {
      --primary-color: #d9534f;
      --bg-light: #ffffff;
      --bg-dark: #1e1e1e;
      --text-light: #333333;
      --text-dark: #f5f5f5;
      --border-light: #d9534f;
      --border-dark: #f8d7da;
    }
    @media (prefers-color-scheme: dark) {
      body { background-color: var(--bg-dark); color: var(--text-dark); }
      .container { background: #292929; color: var(--text-dark); }
      .reason { background-color: #442222; border-left: 5px solid var(--border-dark); }
      .footer { background: #1e1e1e; color: #aaaaaa; }
    }
    body {
      font-family: Arial, sans-serif;
      background-color: var(--bg-light);
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: var(--bg-light);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 30px;
    }
    h1 {
      color: var(--primary-color);
      font-size: 24px;
      margin-bottom: 20px;
      text-align: center;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: var(--text-light);
      margin-bottom: 20px;
    }
    .reason {
      margin-top: 20px;
      padding: 15px;
      background-color: #f8d7da;
      border-left: 5px solid var(--border-light);
      color: #721c24;
      font-size: 15px;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #666666;
      text-align: center;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #0073b1;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
    .button:hover { background-color: #005f99; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Account Suspension Notice</h1>
    <p>Dear ${name},</p>
    <p>We regret to inform you that your account has been temporarily suspended due to the following reason:</p>
    <div class="reason">
      <strong>Reason:</strong> ${reason || "No specific reason provided."}
    </div>
    <p>If you believe this is an error or would like to resolve this issue, please contact our support team immediately.</p>
    <a href="mailto:support@selectskillset.com" class="button">Contact Support</a>
    <div class="footer">
      Best regards,<br>
      <strong>SELECTSKILLSET Team</strong><br>
      &copy; ${new Date().getFullYear()} SELECTSKILLSET. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const activateAccountTemplate = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Activation Successful</title>
  <style>
    :root {
      --primary-color: #28a745;
      --bg-light: #ffffff;
      --bg-dark: #1e1e1e;
      --text-light: #333333;
      --text-dark: #f5f5f5;
      --border-light: #28a745;
      --border-dark: #e9f7ef;
    }
    @media (prefers-color-scheme: dark) {
      body { background-color: var(--bg-dark); color: var(--text-dark); }
      .container { background: #292929; color: var(--text-dark); }
      .message { background-color: #224422; border-left: 5px solid var(--border-dark); }
      .footer { background: #1e1e1e; color: #aaaaaa; }
    }
    body {
      font-family: Arial, sans-serif;
      background-color: var(--bg-light);
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: var(--bg-light);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 30px;
    }
    h1 {
      color: var(--primary-color);
      font-size: 24px;
      margin-bottom: 20px;
      text-align: center;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: var(--text-light);
      margin-bottom: 20px;
    }
    .message {
      margin-top: 20px;
      padding: 15px;
      background-color: #e9f7ef;
      border-left: 5px solid var(--border-light);
      color: #155724;
      font-size: 15px;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #666666;
      text-align: center;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #0073b1;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
    .button:hover { background-color: #005f99; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome Back, ${name}!</h1>
    <p>Your account has been successfully activated. You can now log in and explore our platform.</p>
    <div class="message">
      <strong>Next Steps:</strong>
      <ul>
        <li>Update your profile to enhance your visibility.</li>
        <li>Connect with industry professionals and explore opportunities.</li>
        <li>Stay updated with the latest features and offerings.</li>
      </ul>
    </div>
    <p>We’re glad to have you on board! If you need any assistance, feel free to contact our support team.</p>
    <a href="https://select-skill-set-frontend-testing.vercel.app/" class="button">Log In Now</a>
    <div class="footer">
      Best regards,<br>
      <strong>SELECTSKILLSET Team</strong><br>
      &copy; ${new Date().getFullYear()} SELECTSKILLSET. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
