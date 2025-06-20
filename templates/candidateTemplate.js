export const candidateTemplate = (
  candidateName,
  date,
  time,
  meetLink,
  interviewRequestId,
  interviewerId,
  url
) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Scheduled</title>
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
        border-radius: 12px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .header img {
        width: 150px;
        height: auto;
      }
      .sub-header {
        background-color: #e9e9ff;
        color: #4338CA;
        padding: 12px;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
      }
      .content {
        padding: 30px;
      }
      .details {
        margin: 25px 0;
        font-size: 16px;
      }
      .date-time {
        font-size: 16px;
        margin-top: 10px;
        font-weight: 600;
      }
      .meet-link-btn, .feedback-btn {
        display: inline-block;
        margin: 20px 0;
        padding: 12px 25px;
        background: linear-gradient(90deg, #4338CA, #7C3AED);
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        font-size: 16px;
        transition: background-color 0.3s ease;
      }
      .meet-link-btn:hover, .feedback-btn:hover {
        background: linear-gradient(90deg, #7C3AED, #4338CA);
      }
      .footer {
        background-color: #f8fafc;
        color: #718096;
        text-align: center;
        padding: 20px;
        font-size: 14px;
      }
      .footer a {
        color: #4338CA;
        text-decoration: none;
      }
      h1, p {
        margin: 0;
        padding: 0;
      }
      p {
        margin-bottom: 15px;
      }
      hr {
        border: 0;
        height: 1px;
        background: #e2e8f0;
        margin: 25px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo">
      </div>
      <div class="sub-header">Your Interview is Scheduled</div>
      <div class="content">
        <p>Dear ${candidateName},</p>
        <p>We are excited to inform you that your interview has been successfully scheduled. Please find the details below:</p>

        <div class="details">
          <p><strong>Interview Date:</strong> ${date}</p>
          <p><strong>Interview Time:</strong> ${time}</p>
          <p><strong>Join the Interview:</strong> <a href="${meetLink}" target="_blank" style="color: #4338CA;">${meetLink}</a></p>
        </div>

        <a href="${meetLink}" class="meet-link-btn">Join Interview</a>

        <hr>

        <p>After the interview, we kindly request your valuable feedback regarding your interview experience. Your input helps us to improve our process and ensure a better experience for future candidates.</p>
        <p>Please take a moment to rate your experience and provide feedback about your interviewer by clicking the button below:</p>

        <a href="${url}/candidate-feedback/${interviewerId}/${interviewRequestId}" class="feedback-btn">Give Feedback & Rate Interviewer</a>

        <hr>

        <p>Thank you for being a part of the interview process. We wish you the best of luck!</p>
      </div>

      <div class="footer">
        This email was sent by <strong>SELECTSKILLSET</strong>. If you have any questions or concerns, please feel free to <a href="mailto:support@selectskillset.com">contact us</a>.
      </div>
    </div>
  </body>
  </html>
`;

export const rescheduleCandidateTemplate = (
  candidateName,
  newDate,
  newTime,
  meetLink,
  interviewRequestId,
  interviewerId,
  url
) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Rescheduled</title>
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
        border-radius: 12px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .header img {
        width: 150px;
        height: auto;
      }
      .sub-header {
        background-color: #e9e9ff;
        color: #4338CA;
        padding: 12px;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
      }
      .content {
        padding: 30px;
      }
      .details {
        margin: 25px 0;
        font-size: 16px;
      }
      .date-time {
        font-size: 16px;
        margin-top: 10px;
        font-weight: 600;
      }
      .meet-link-btn, .feedback-btn {
        display: inline-block;
        margin: 20px 0;
        padding: 12px 25px;
        background: linear-gradient(90deg, #4338CA, #7C3AED);
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        font-size: 16px;
        transition: background-color 0.3s ease;
      }
      .meet-link-btn:hover, .feedback-btn:hover {
        background: linear-gradient(90deg, #7C3AED, #4338CA);
      }
      .footer {
        background-color: #f8fafc;
        color: #718096;
        text-align: center;
        padding: 20px;
        font-size: 14px;
      }
      .footer a {
        color: #4338CA;
        text-decoration: none;
      }
      hr {
        border: 0;
        height: 1px;
        background: #e2e8f0;
        margin: 25px 0;
      }
      ul {
        margin: 15px 0;
        padding-left: 20px;
      }
      li {
        margin-bottom: 8px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo">
      </div>
      <div class="sub-header">Your Interview Has Been Rescheduled</div>
      <div class="content">
        <p>Dear ${candidateName},</p>
        <p>Your interview schedule has been updated. Please review the new details below:</p>

        <div class="details">
          <p><strong>Revised Date:</strong> ${newDate}</p>
          <p><strong>Updated Time:</strong> ${newTime}</p>
          <p><strong>New Meeting Link:</strong> <a href="${meetLink}" target="_blank" style="color: #4338CA;">${meetLink}</a></p>
        </div>

        <a href="${meetLink}" class="meet-link-btn">Join Rescheduled Interview</a>

        <hr>

        <p>Important notes regarding this change:</p>
        <ul>
          <li>Your previous interview slot is no longer reserved.</li>
          <li>The interview duration remains unchanged.</li>
          <li>Please test the new meeting link 10 minutes before the interview.</li>
        </ul>

        <p>After your interview, we value your feedback about the process and your interviewer. This helps us improve our platform for all candidates:</p>

        <a href="${url}/candidate-feedback/${interviewerId}/${interviewRequestId}" class="feedback-btn">Share Interview Experience</a>

        <hr>

        <p>If you encounter any issues with the new schedule or need assistance, please contact us immediately at <a href="mailto:support@selectskillset.com" style="color: #4338CA;">support@selectskillset.com</a>.</p>

        <p>We appreciate your understanding and wish you success in your interview!</p>
      </div>

      <div class="footer">
        This email was sent by <strong>SELECTSKILLSET</strong>. For any inquiries, <a href="mailto:support@selectskillset.com">contact our support team</a>.
      </div>
    </div>
  </body>
  </html>
`;
