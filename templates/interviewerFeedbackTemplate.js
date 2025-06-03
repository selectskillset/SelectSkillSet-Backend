export const interviewerFeedbackTemplate = (
  interviewerName,
  latestFeedbacks,
  url
) => {
  const visibleFeedbacks = latestFeedbacks.slice(0, 2);
  const hiddenFeedbacksCount = latestFeedbacks.length - 2;

  const getStarRating = (rating) => {
    const filledStars = Math.round(rating);
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= filledStars) {
        starsHtml += `<span style="color: #FFD700; font-size: 18px;">★</span>`;
      } else {
        starsHtml += `<span style="color: #dcdcdc; font-size: 18px;">★</span>`;
      }
    }
    return starsHtml;
  };

  const visibleFeedbackHtml = visibleFeedbacks
    .map(
      (feedbackSection) => `
        <div style="margin-bottom: 20px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
          <h3 style="font-size: 20px; color: #4338CA; font-weight: bold; margin-top: 0;">${
            feedbackSection.section
          }</h3>
          <p style="font-size: 16px; color: #4a5568;"><strong>Rating:</strong> ${getStarRating(
            feedbackSection.rating
          )}</p>
          <p style="font-size: 16px; color: #4a5568;"><strong>Comment:</strong> ${
            feedbackSection.comment
          }</p>
        </div>
      `
    )
    .join("");

  const hiddenFeedbackHtml =
    hiddenFeedbacksCount > 0
      ? `
        <div style="opacity: 0.4; pointer-events: none; margin-bottom: 20px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
          <p style="font-size: 16px; font-style: italic; color: #4338CA; text-align: center; font-weight: bolder;">
            Feedback hidden for ${hiddenFeedbacksCount} more feedback(s)...
          </p>
        </div>
      `
      : "";

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #4a5568; padding: 20px; max-width: 700px; margin: auto; border: 1px solid #e2e8f0; border-radius: 15px; background-color: #ffffff; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <header style="text-align: center; margin-bottom: 30px;">
        <img src="https://www.selectskillset.com/assets/selectskillset_logo__2_-removebg-preview-ssolSFsy.png" alt="SELECTSKILLSET Logo" style="width: 150px; height: auto;">
        <p style="font-size: 18px; color: #4338CA; margin-top: 10px;">Insights that drive professional growth</p>
      </header>

      <!-- Main Content -->
      <section style="padding: 30px;">
        <h2 style="font-size: 24px; color: #4338CA; text-align: center; margin-bottom: 20px;">Hello ${interviewerName},</h2>
        <p style="font-size: 16px; color: #4a5568; text-align: center;">Thank you for conducting interviews. Here’s the feedback from candidates to help you refine your interviewing approach:</p>

        <!-- Visible Feedback Section -->
        <div style="margin-top: 20px;">${visibleFeedbackHtml}</div>

        <!-- Hidden Feedback Section -->
        <div style="margin-top: 30px; text-align: center; background-color: #f8fafc; padding: 20px; border-radius: 10px;">
          ${hiddenFeedbackHtml}

          <!-- Unlock Button -->
          <div style="text-align: center; margin-top: 20px;">
            <a href="${url}/interviewer-login" style="display: inline-block; padding: 12px 25px; background: linear-gradient(90deg, #4338CA, #7C3AED); color: #ffffff; text-decoration: none; border-radius: 30px; font-size: 16px; font-weight: bold; transition: background-color 0.3s ease;">View All Feedbacks</a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer style="margin-top: 40px; text-align: center; font-size: 14px; color: #718096;">
        <p style="margin: 0;">This email was sent to you by <strong>SELECTSKILLSET</strong>. Helping professionals excel through insights and feedback.</p>
        <p style="margin: 5px 0;">Visit your <a href="${url}" style="color: #4338CA; text-decoration: none;">dashboard</a> for more details.</p>
      </footer>
    </div>
  `;
};
