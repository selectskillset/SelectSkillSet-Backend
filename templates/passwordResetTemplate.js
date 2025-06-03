export const passwordResetTemplate = ({ name, resetUrl }) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            color: #4a5568;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            width: 150px;
            height: auto;
        }
        .content {
            margin: 20px 0;
            font-size: 16px;
            line-height: 1.6;
        }
        .button {
            background: linear-gradient(90deg, #4338CA, #7C3AED);
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo">
            <h1 style="color: #4338CA;">Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hello ${name},</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>This link will expire in 10 minutes. If you didn't request this, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="footer">
            <p>Thank you for using our service!</p>
            <p>Best regards, <strong>SELECTSKILLSET Team</strong></p>
        </div>
    </div>
</body>
</html>
`;
