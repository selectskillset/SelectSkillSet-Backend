export const rescheduleRequestTemplate = (type, data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    .email-wrapper {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      max-width: 680px;
      margin: 2rem auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    
    .email-header {
      background: #0A66C2;
      padding: 2rem;
      text-align: center;
      color: #ffffff;
    }
    
    .email-content {
      padding: 2.5rem;
      color: #1D2226;
    }
    
    .details-card {
      background: #F8F9FA;
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
      color: #666F79;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .detail-value {
      color: #1D2226;
      font-weight: 600;
    }
    
    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 2.5rem 0;
    }
    
    .btn-primary {
      background: #0A66C2;
      color: #FFFFFF !important;
      padding: 0.8rem 2rem;
      border-radius: 24px;
      text-decoration: none;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    
    .btn-secondary {
      background: #FFFFFF;
      color: #0A66C2;
      border: 1px solid #0A66C2;
      padding: 0.8rem 2rem;
      border-radius: 24px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.2s;
    }
    
    .email-footer {
      background: #F3F6F8;
      padding: 1.5rem;
      text-align: center;
      color: #666F79;
      font-size: 0.9rem;
    }
    
    .legal-links {
      margin-top: 1rem;
    }
    
    .legal-links a {
      color: #0A66C2;
      text-decoration: none;
      margin: 0 0.5rem;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <h1>SELECTSKILLSET</h1>
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
    <a href="${data.url}/candidate/approve-reschedule?requestId=${data.interviewId}&candidateId=${data.candidateId}" 
       class="btn-primary">
       Approve Request
    </a>
    <a href="${data.url}/candidate/reject-reschedule?requestId=${data.interviewId}&candidateId=${data.candidateId}" 
       class="btn-secondary">
       Reject Request
    </a>`
      : `
    <a href="${data.url}/interviewer/approve-reschedule?requestId=${data.interviewId}&interviewerId=${data.interviewerId}" 
       class="btn-primary">
       Approve Request
    </a>
    <a href="${data.url}/interviewer/reject-reschedule?requestId=${data.interviewId}&interviewerId=${data.interviewerId}" 
       class="btn-secondary">
       Reject Request
    </a>`
  }
</div>

      <p style="text-align: center; color: #666F79;">
        Please respond by ${data.newDate}<br>
        <small>Request ID: ${data.interviewId}</small>
      </p>
    </div>

    <div class="email-footer">
      <p>© ${new Date().getFullYear()} SELECTSKILLSET</p>
      <div class="legal-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Contact Us</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
