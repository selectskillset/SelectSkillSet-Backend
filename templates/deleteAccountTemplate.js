export const deleteAccountTemplate = (name, userType) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deletion Notice</title>
    <style>
        :root {
            --primary-color: #0073b1;
            --danger-color: #d9534f;
            --text-light: #333;
            --text-dark: #f4f4f4;
            --bg-light: #ffffff;
            --bg-dark: #1c1c1c;
            --card-light: #f8f9fa;
            --card-dark: #2a2a2a;
        }

        @media (prefers-color-scheme: dark) {
            body {
                background-color: var(--bg-dark);
                color: var(--text-dark);
            }
            .container {
                background: var(--card-dark);
                box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);
            }
            .content p, .content li, .footer {
                color: var(--text-dark);
            }
            .footer {
                background: #242424;
            }
        }

        body {
            margin: 0;
            padding: 0;
            background-color: var(--bg-light);
            font-family: 'Arial', sans-serif;
            color: var(--text-light);
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            background: var(--bg-light);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: var(--primary-color);
            padding: 20px;
            text-align: center;
            color: white;
        }

        .header h2 {
            margin: 0;
            font-size: 22px;
        }

        .content {
            padding: 24px;
            line-height: 1.6;
        }

        .content p {
            margin: 10px 0;
            font-size: 16px;
        }

        .content ul {
            padding-left: 20px;
        }

        .content ul li {
            margin-bottom: 8px;
            font-size: 14px;
        }

        .highlight {
            color: var(--danger-color);
            font-weight: bold;
        }

        .footer {
            background: var(--card-light);
            text-align: center;
            padding: 16px;
            font-size: 14px;
            color: #6c757d;
        }

        .footer p {
            margin: 4px 0;
        }

        .contact {
            font-size: 13px;
        }

        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: var(--primary-color);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }

        .button:hover {
            background-color: #005f99;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Account Deletion Notice</h2>
        </div>
        <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>We regret to inform you that your <strong>${userType}</strong> account on <strong>SELECTSKILLSET</strong> has been permanently deleted.</p>
            
            <p class="highlight">What this means for you:</p>
            <ul>
                <li>Your account and all associated data have been removed from our platform.</li>
                <li>You will no longer have access to SELECTSKILLSET services.</li>
                <li>Any active services, subscriptions, or engagements have been terminated.</li>
            </ul>

            <p>If you believe this action was taken in error or wish to appeal, please reach out to our support team within the next 7 days.</p>
            <a href="mailto:support@selectskillset.com" class="button">Contact Support</a>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p><strong>SELECTSKILLSET Team</strong></p>
            <p class="contact">
                Need help? Contact support: <a href="mailto:support@selectskillset.com">support@selectskillset.com</a><br/>
                &copy; ${new Date().getFullYear()} SELECTSKILLSET. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
`;
