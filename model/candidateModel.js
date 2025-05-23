import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSuspended: { type: Boolean, default: false },
    phoneNumber: { type: String },
    countryCode: { type: String },
    jobTitle: { type: String },
    location: { type: String },
    hasAcceptedTerms: { type: Boolean, default: false },
    hasAcceptedPrivacyPolicy: { type: Boolean, required: true },
    gdprConsent: { type: Boolean, required: true },
    consentTimestamp: { type: Date, default: Date.now },
    profilePhoto: {
      type: String,
      default:
        "https://cdn.vectorstock.com/i/500p/97/32/man-silhouette-profile-picture-vector-2139732.jpg",
    },
    resume: { type: String },
    linkedIn: { type: String },
    skills: [{ type: String }],
    // Added experiences array
    experiences: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        location: { type: String, required: true },
        employmentType: { type: String, required: true },
        description: { type: String },
        startDate: {
          type: String,
          required: true,
        },
        endDate: {
          type: String,
        },
        totalExperience: { type: String },

        current: { type: Boolean, default: false },
      },
    ],
    totalExperience: { type: String, default: "0 yrs 0 mo" },

    statistics: {
      completedInterviews: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      totalFeedbackCount: { type: Number, default: 0 },
      feedbacks: [
        {
          interviewRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          feedbackData: { type: Object, required: true },
          rating: { type: Number, required: true },
        },
      ],
    },
    scheduledInterviews: [
      {
        interviewerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Interviewer",
        },
        date: { type: String, required: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
        price: { type: String },
        status: {
          type: String,
          enum: [
            "Requested",
            "Approved",
            "Cancelled",
            "Completed",
            "RescheduleRequested",
            "Re-Scheduled",
            "Scheduled",
            "Reschedule Requested",
          ],
          default: "Requested",
        },
        googleMeetLink: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);
