export const interviewerTemplate = (
  interviewerName,
  candidateName,
  date,
  time,
  meetLink,
  interviewRequestId,
  candidateId,
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
        color: #333;
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
        background-color: #0077B5; /* LinkedIn Blue */
        color: #ffffff;
        padding: 30px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        border-radius: 12px 12px 0 0;
      }
      .sub-header {
        background-color: #f1f5f9;
        color: #0077B5; /* LinkedIn Blue */
        padding: 12px;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
      }
      .content {
        padding: 40px;
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
        padding: 14px 30px;
        background-color: #0077B5; /* LinkedIn Blue */
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        font-size: 18px;
        transition: background-color 0.3s ease;
      }
      .meet-link-btn:hover, .feedback-btn:hover {
        background-color: #006193; /* Darker LinkedIn Blue */
      }
      .footer {
        background-color: #f1f5f9;
        color: #555;
        text-align: center;
        padding: 20px;
        font-size: 14px;
        border-radius: 0 0 12px 12px;
      }
      .footer a {
        color: #0077B5; /* LinkedIn Blue */
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">SELECTSKILLSET</div>
      <div class="sub-header">Interview Scheduled</div>
      <div class="content">
        <p>Dear ${interviewerName},</p>
        <p>Your interview with <strong>${candidateName}</strong> has been scheduled. Please find the details below:</p>
        
        <div class="details">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Meet Link:</strong> <a href="${meetLink}" target="_blank">${meetLink}</a></p>
        </div>
        
        <a href="${meetLink}" class="meet-link-btn">Join Interview</a>
        
        <hr>
        
        <p>We encourage you to provide feedback on the candidate after the interview is completed. Your valuable feedback helps improve our recruitment process and ensure the best fit for your organization.</p>
        <p>Click the button below to rate the candidate's performance and provide your insights:</p>
        
        <a href="${url}/interviewer-feedback/${candidateId}/${interviewRequestId}" class="feedback-btn">Give Feedback on Candidate</a>
        
        <hr>
        
        <p>Thank you for your time and effort in reviewing candidates. We appreciate your contribution to our hiring process.</p>
      </div>
      
      <div class="footer">
        This email was sent by <strong>SELECTSKILLSET</strong>. If you have any questions, please <a href="mailto:support@selectskillset.com">contact us</a>.
      </div>
    </div>
  </body>
  </html>
`;

export const rescheduleInterviewerTemplate = (
  interviewerName,
  candidateName,
  newDate,
  newTime,
  meetLink,
  interviewRequestId,
  candidateId,
  url
) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Rescheduled</title>
    <style>
      /* Keep the same CSS styles as original template for consistency */
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f8fafc;
        margin: 0;
        padding: 0;
        color: #333;
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
        background-color: #0077B5;
        color: #ffffff;
        padding: 30px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        border-radius: 12px 12px 0 0;
      }
      .sub-header {
        background-color: #f1f5f9;
        color: #0077B5;
        padding: 12px;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
      }
      .content {
        padding: 40px;
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
        padding: 14px 30px;
        background-color: #0077B5;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        font-size: 18px;
        transition: background-color 0.3s ease;
      }
      .meet-link-btn:hover, .feedback-btn:hover {
        background-color: #006193;
      }
      .footer {
        background-color: #f1f5f9;
        color: #555;
        text-align: center;
        padding: 20px;
        font-size: 14px;
        border-radius: 0 0 12px 12px;
      }
      .footer a {
        color: #0077B5;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">SELECTSKILLSET</div>
      <div class="sub-header">Interview Rescheduled</div>
      <div class="content">
        <p>Dear ${interviewerName},</p>
        <p>The interview with <strong>${candidateName}</strong> has been rescheduled. Please review the updated details below:</p>
        
        <div class="details">
          <p><strong>New Date:</strong> ${newDate}</p>
          <p><strong>Revised Time:</strong> ${newTime}</p>
          <p><strong>Updated Meeting Link:</strong> <a href="${meetLink}" target="_blank">${meetLink}</a></p>
        </div>
        
        <a href="${meetLink}" class="meet-link-btn">Join Rescheduled Interview</a>
        
        <hr>
        
        <p>Please note the following important information regarding the rescheduled interview:</p>
        <ul>
          <li>The previous interview slot is no longer reserved</li>
          <li>Candidate has confirmed availability for the new time</li>
          <li>All other interview parameters remain unchanged</li>
        </ul>

        <p>Your feedback remains crucial for our evaluation process. After conducting the interview, please provide your assessment using the button below:</p>
        
        <a href="${url}/interviewer-feedback/${candidateId}/${interviewRequestId}" class="feedback-btn">Submit Candidate Feedback</a>
        
        <hr>
        
        <p>We appreciate your flexibility in accommodating this change. If you encounter any scheduling conflicts or require additional information, please notify us immediately.</p>
        
        <p>Thank you for your continued collaboration in our recruitment process.</p>
      </div>
      
      <div class="footer">
        This email was sent by <strong>SELECTSKILLSET</strong>. For assistance, contact <a href="mailto:support@selectskillset.com">support@selectskillset.com</a>.
      </div>
    </div>
  </body>
  </html>
`;
