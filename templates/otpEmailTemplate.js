const otpEmailTemplate = (otp) => {
  return `
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
            margin: 50px auto;
            background-color: #ffffff;
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
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .otp-box {
            display: flex;
            justify-content: center;
            margin: 20px 0;
          }
          .otp-box input {
            width: 40px;
            height: 50px;
            font-size: 24px;
            text-align: center;
            margin: 0 5px;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            background-color: #f8fafc;
            color: #4338CA;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #718096;
          }
          .copy-note {
            font-size: 14px;
            color: #718096;
            text-align: center;
            margin-top: 10px;
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
            <h1>OTP Verification</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to send you a One-Time Password (OTP) for verification.</p>
            <p>Your OTP code is:</p>
            <div class="otp-box">
              <input type="text" value="${otp[0]}" readonly />
              <input type="text" value="${otp[1]}" readonly />
              <input type="text" value="${otp[2]}" readonly />
              <input type="text" value="${otp[3]}" readonly />
              <input type="text" value="${otp[4]}" readonly />
              <input type="text" value="${otp[5]}" readonly />
            </div>
            <p class="copy-note">Please use this OTP to complete your verification process.</p>
            <p>If you did not request this, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>Thank you for using our service!</p>
            <p>Best regards, <strong>SELECTSKILLSET Team</strong></p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export default otpEmailTemplate;
