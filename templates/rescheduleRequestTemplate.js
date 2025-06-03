export const rescheduleRequestTemplate = (type, data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      color: #4a5568;
    }
    .email-wrapper {
      max-width: 680px;
      margin: 2rem auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }
    .email-header {
      padding: 2rem;
      text-align: center;
      color: #ffffff;
    }
    .email-header img {
      width: 150px;
      height: auto;
    }
    .email-content {
      padding: 2.5rem;
      color: #4a5568;
    }
    .email-content h2 {
      color: #4338CA;
      font-size: 24px;
    }
    .details-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 2rem 0;
    }
    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.2rem;
    }
    .detail-label {
      color: #718096;
      font-size: 16px;
    }
    .detail-value {
      color: #4a5568;
      font-weight: 600;
    }
    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 2.5rem 0;
    }
    .btn-primary {
      background: linear-gradient(90deg, #4338CA, #7C3AED);
      color: #ffffff !important;
      padding: 0.8rem 2rem;
      border-radius: 24px;
      text-decoration: none;
      font-weight: 600;
    }
    .btn-secondary {
      background: #ffffff;
      color: #4338CA;
      border: 1px solid #4338CA;
      padding: 0.8rem 2rem;
      border-radius: 24px;
      text-decoration: none;
      font-weight: 600;
    }
    .email-footer {
      background: #f8fafc;
      padding: 1.5rem;
      text-align: center;
      color: #718096;
      font-size: 14px;
    }
    .legal-links {
      margin-top: 1rem;
    }
    .legal-links a {
      color: #4338CA;
      text-decoration: none;
      margin: 0 0.5rem;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo">
    </div>
    <div class="email-content">
      <h2>Interview Reschedule Request</h2>
      <p>Hello ${
        type === "candidate" ? data.candidateName : data.interviewerName
      },</p>
      <p>Please review and confirm the proposed schedule adjustment:</p>

      <div class="details-card">
        <div class="detail-item">
          <span class="detail-label">Date</span>
          <span class="detail-value">${data.newDate}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Time</span>
          <span class="detail-value">${data.timeSlot}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Position</span>
          <span class="detail-value">${data.position}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Participants</span>
          <span class="detail-value">
            ${data.candidateName}<br>
            ${data.interviewerName}
          </span>
        </div>
      </div>

      <div class="action-buttons">
        ${
          type === "candidate"
            ? `
            <a href="${data.url}/candidate/approve-reschedule?requestId=${data.interviewId}&candidateId=${data.candidateId}" class="btn-primary">
              Approve Request
            </a>
            <a href="${data.url}/candidate/reject-reschedule?requestId=${data.interviewId}&candidateId=${data.candidateId}" class="btn-secondary">
              Reject Request
            </a>`
            : `
            <a href="${data.url}/interviewer/approve-reschedule?requestId=${data.interviewId}&interviewerId=${data.interviewerId}" class="btn-primary">
              Approve Request
            </a>
            <a href="${data.url}/interviewer/reject-reschedule?requestId=${data.interviewId}&interviewerId=${data.interviewerId}" class="btn-secondary">
              Reject Request
            </a>`
        }
      </div>

      <p style="text-align: center; color: #718096;">
        Please respond by ${data.newDate}<br>
        <small>Request ID: ${data.interviewId}</small>
      </p>
    </div>

    <div class="email-footer">
      <p>©  SELECTSKILLSET</p>
      
    </div>
  </div>
</body>
</html>
`;
