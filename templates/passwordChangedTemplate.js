export const passwordChangedTemplate = ({ name }) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
        .header { color: #0077B5; font-size: 24px; border-bottom: 2px solid #0077B5; padding-bottom: 10px; }
        .content { margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Password Changed Successfully</div>
        <div class="content">
            <p>Hello ${name},</p>
            <p>Your password has been successfully changed.</p>
            <p>If you didn't make this change, please contact our support team immediately.</p>
        </div>
    </div>
</body>
</html>
`;