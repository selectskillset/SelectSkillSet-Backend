import { calculateProfileCompletion } from "../services/candidateService.js";
import { generateCompleteEmail, generateIncompleteEmail } from "../templates/profileCompletionEmailTemplate.js";
import { sendEmail } from "./emailService.js";

export const sendProfileCompletionEmail = async (candidate) => {
  const completion = calculateProfileCompletion(candidate);

  let html, subject;
  if (completion.isComplete) {
    subject = `Congratulations! Your Profile is 100% Complete 🎉`;
    html = generateCompleteEmail(candidate.firstName);
  } else {
    subject = `Your Profile is ${completion.totalPercentage}% Complete`;
    html = generateIncompleteEmail(
      candidate.firstName,
      completion.totalPercentage,
      completion.missingSections
    );
  }

  await sendEmail(candidate.email, subject, '', html);
};