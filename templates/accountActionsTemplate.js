export const suspendAccountTemplate = (name, reason) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Suspension Notice</title>
  <style>
    :root {
      --primary-color: #4338CA;
      --secondary-color: #7C3AED;
      --bg-light: #ffffff;
      --bg-dark: #121212;
      --text-light: #333333;
      --text-dark: #f5f5f5;
      --border-light: #4338CA;
      --border-dark: #7C3AED;
      --gradient: linear-gradient(90deg, #4338CA, #7C3AED);
    }

    @media (prefers-color-scheme: dark) {
      body { background-color: var(--bg-dark); color: var(--text-dark); }
      .container { background: #1e1e1e; color: var(--text-dark); }
      .reason { background-color: #292929; border-left: 5px solid var(--border-dark); }
      .footer { background: white; color: #aaaaaa; }
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: var(--bg-light);
      margin: 0;
      padding: 20px;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: var(--bg-light);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 30px;
      color: var(--text-light);
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo img {
      max-width: 150px;
      height: auto;
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
      margin-bottom: 20px;
    }

    .reason {
      margin-top: 20px;
      padding: 15px;
      background-color: #f0f0ff;
      border-left: 5px solid var(--border-light);
      color: var(--primary-color);
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
      background: var(--gradient);
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background: linear-gradient(90deg, #7C3AED, #4338CA);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo">
    </div>
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
      &copy;SELECTSKILLSET. All rights reserved.
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
      --primary-color: #4338CA;
      --secondary-color: #7C3AED;
      --bg-light: #ffffff;
      --bg-dark: #121212;
      --text-light: #333333;
      --text-dark: #f5f5f5;
      --border-light: #4338CA;
      --border-dark: #7C3AED;
      --gradient: linear-gradient(90deg, #4338CA, #7C3AED);
    }

    @media (prefers-color-scheme: dark) {
      body { background-color: var(--bg-dark); color: var(--text-dark); }
      .container { background: #1e1e1e; color: var(--text-dark); }
      .message { background-color: #292929; border-left: 5px solid var(--border-dark); }
      .footer { background: white; color: #aaaaaa; }
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: var(--bg-light);
      margin: 0;
      padding: 20px;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: var(--bg-light);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 30px;
      color: var(--text-light);
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo img {
      max-width: 150px;
      height: auto;
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
      margin-bottom: 20px;
    }

    .message {
      margin-top: 20px;
      padding: 15px;
      background-color: #f0f0ff;
      border-left: 5px solid var(--border-light);
      color: var(--primary-color);
      font-size: 15px;
      border-radius: 4px;
    }

    .message ul {
      margin: 10px 0;
      padding-left: 20px;
    }

    .message li {
      margin-bottom: 5px;
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
      background: var(--gradient);
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background: linear-gradient(90deg, #7C3AED, #4338CA);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo">
    </div>
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
    <a href="https://selectskillset.com/" class="button">Log In Now</a>
    <div class="footer">
      Best regards,<br>
      <strong>SELECTSKILLSET Team</strong><br>
      &copy; SELECTSKILLSET. All rights reserved.
    </div>
  </div>
</body>
</html>

`;
