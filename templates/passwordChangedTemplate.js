export const passwordChangedTemplate = ({ name }) => `
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
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #718096;
        }
        .highlight {
            color: #4338CA;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo">
            <h1 style="color: #4338CA;">Password Changed Successfully</h1>
        </div>
        <div class="content">
            <p>Hello ${name},</p>
            <p>Your password has been successfully changed.</p>
            <p>If you didn't make this change, please <span class="highlight">contact our support team immediately</span> at <a href="mailto:support@selectskillset.com" style="color: #4338CA; text-decoration: none;">support@selectskillset.com</a>.</p>
        </div>
        <div class="footer">
            <p>Thank you for using our service!</p>
            <p>Best regards, <strong>SELECTSKILLSET Team</strong></p>
        </div>
    </div>
</body>
</html>
`;
