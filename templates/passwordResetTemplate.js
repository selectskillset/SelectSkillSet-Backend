export const passwordResetTemplate = ({ name, resetUrl }) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
        .header { color: #0077B5; font-size: 24px; border-bottom: 2px solid #0077B5; padding-bottom: 10px; }
        .content { margin: 20px 0; }
        .button { 
            background-color: #0077B5; 
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Password Reset Request</div>
        <div class="content">
            <p>Hello ${name},</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>This link will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`;