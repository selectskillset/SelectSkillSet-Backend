export const generateCompleteEmail = (firstName) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f6f8;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            border-radius: 12px;
            background: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h2 {
            font-size: 24px;
            color: #0A66C2;
            margin: 0;
          }
          .header p {
            font-size: 14px;
            color: #666;
            margin: 5px 0 0;
          }
          h1 {
            color: #0A66C2;
            text-align: center;
            font-size: 28px;
            margin-bottom: 10px;
          }
          p {
            font-size: 16px;
            text-align: center;
            margin: 10px 0;
            color: #555;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            font-size: 16px;
            color: #fff;
            background-color: #0A66C2;
            text-decoration: none;
            border-radius: 8px;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #004182;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            text-align: center;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>SELECTSKILLSET</h2>
            <p>Your Professional Profile Companion</p>
          </div>
          <h1>🎉 Congratulations, ${firstName}! 🎉</h1>
          <p>Your profile is now 100% complete!</p>
          <p>This ensures you're fully prepared to showcase your skills and experience.</p>
          <div style="text-align:center;">
            <a href=${process.env.WEBSITE_URL} class="button">View Your Profile</a>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact us at <a href="mailto:support@yourwebsite.com" style="color: #0A66C2;">support@yourwebsite.com</a>.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const generateIncompleteEmail = (firstName, totalPercentage, missingSections) => {
  const missingSectionsList = missingSections.map((section) => {
    const { section: sectionName, missingDetails } = section;
    const details = missingDetails && missingDetails.length
      ? ` (Missing: ${missingDetails.join(', ')})`
      : '';
    return `<li><strong>${sectionName}</strong>${details}</li>`;
  }).join('');

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f6f8;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            border-radius: 12px;
            background: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h2 {
            font-size: 24px;
            color: #0A66C2;
            margin: 0;
          }
          .header p {
            font-size: 14px;
            color: #666;
            margin: 5px 0 0;
          }
          h1 {
            color: #FF9F43;
            text-align: center;
            font-size: 28px;
            margin-bottom: 10px;
          }
          p {
            font-size: 16px;
            text-align: center;
            margin: 10px 0;
            color: #555;
          }
          ul {
            list-style-type: disc;
            padding-left: 40px;
            margin: 20px 0;
            font-size: 16px;
            color: #555;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            font-size: 16px;
            color: #fff;
            background-color: #FF9F43;
            text-decoration: none;
            border-radius: 8px;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #e68a00;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            text-align: center;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>SELECTSKILLSET</h2>
            <p>Your Professional Profile Companion</p>
          </div>
          <h1>🌟 Hi, ${firstName}! 🌟</h1>
          <p>Your profile is currently <strong>${totalPercentage}% complete</strong>.</p>
          <p>To ensure your profile reflects your full potential, please complete the following sections:</p>
          <ul>
            ${missingSectionsList}
          </ul>
          <div style="text-align:center;">
            <a href=${process.env.WEBSITE_URL} class="button">Complete Your Profile</a>
          </div>
          <div class="footer">
            <p>If you need assistance, feel free to reach out to us at <a href="mailto:support@yourwebsite.com" style="color: #FF9F43;">support@yourwebsite.com</a>.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
