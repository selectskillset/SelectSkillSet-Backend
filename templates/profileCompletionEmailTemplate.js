export const generateCompleteEmail = (firstName) => `
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
            padding: 30px;
            border-radius: 12px;
            background: #ffffff;
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
            padding: 20px;
        }
        h1 {
            color: #4338CA;
            text-align: center;
            font-size: 28px;
            margin-bottom: 10px;
        }
        p {
            font-size: 16px;
            text-align: center;
            margin: 10px 0;
            color: #4a5568;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            font-size: 16px;
            color: #fff;
            background: linear-gradient(90deg, #4338CA, #7C3AED);
            text-decoration: none;
            border-radius: 8px;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background: linear-gradient(90deg, #7C3AED, #4338CA);
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            text-align: center;
            color: #718096;
        }
        .footer a {
            color: #4338CA;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo">
            <h1>Your Professional Profile Companion</h1>
        </div>
        <div class="content">
            <h1>🎉 Congratulations, ${firstName}! 🎉</h1>
            <p>Your profile is now 100% complete!</p>
            <p>This ensures you're fully prepared to showcase your skills and experience.</p>
            <div style="text-align: center;">
                <a href="${process.env.WEBSITE_URL}" class="button">View Your Profile</a>
            </div>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to contact us at <a href="mailto:support@selectskillset.com">support@selectskillset.com</a>.</p>
        </div>
    </div>
</body>
</html>
`;

export const generateIncompleteEmail = (
  firstName,
  totalPercentage,
  missingSections
) => {
  const missingSectionsList = missingSections
    .map((section) => {
      const { section: sectionName, missingDetails } = section;
      const details =
        missingDetails && missingDetails.length
          ? ` (Missing: ${missingDetails.join(", ")})`
          : "";
      return `<li><strong>${sectionName}</strong>${details}</li>`;
    })
    .join("");

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
            margin: 40px auto;
            padding: 30px;
            border-radius: 12px;
            background: #ffffff;
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
          .header h2 {
            font-size: 24px;
            color: #4338CA;
            margin: 0;
          }
          .header p {
            font-size: 14px;
            color: #718096;
            margin: 5px 0 0;
          }
          h1 {
            color: #4338CA;
            text-align: center;
            font-size: 28px;
            margin-bottom: 10px;
          }
          p {
            font-size: 16px;
            text-align: center;
            margin: 10px 0;
            color: #4a5568;
          }
          ul {
            list-style-type: disc;
            padding-left: 40px;
            margin: 20px 0;
            font-size: 16px;
            color: #4a5568;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            font-size: 16px;
            color: #fff;
            background: linear-gradient(90deg, #4338CA, #7C3AED);
            text-decoration: none;
            border-radius: 8px;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background: linear-gradient(90deg, #7C3AED, #4338CA);
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            text-align: center;
            color: #718096;
          }
          .footer a {
            color: #4338CA;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo">
            <p>Your Professional Profile Companion</p>
          </div>
          <h1>🌟 Hi, ${firstName}! 🌟</h1>
          <p>Your profile is currently <strong>${totalPercentage}% complete</strong>.</p>
          <p>To ensure your profile reflects your full potential, please complete the following sections:</p>
          <ul>
            ${missingSectionsList}
          </ul>
          <div style="text-align: center;">
            <a href="${process.env.WEBSITE_URL}" class="button">Complete Your Profile</a>
          </div>
          <div class="footer">
            <p>If you need assistance, feel free to reach out to us at <a href="mailto:support@selectskillset.com">support@selectskillset.com</a>.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
