import mongoose from "mongoose";

const interviewerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isSuspended: { type: Boolean, default: false },
  hasExperience: { type: Boolean, default: false },
  location: { type: String },
  hasAcceptedTerms: { type: Boolean, default: false },
  hasAcceptedPrivacyPolicy: { type: Boolean, required: true  },
  gdprConsent: { type: Boolean, required: true  },
  consentTimestamp: { type: Date, default: Date.now },
  isVerified: {
    type: Boolean,
    default: false,
  },
  phoneNumber: { type: String },
  countryCode: { type: String },
  jobTitle: { type: String },
  profilePhoto: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
  },
  experience: { type: String },
  totalInterviews: { type: String },
  price: { type: String },
  skills: [{ type: String }],
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
  interviewRequests: [
    {
      candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
      candidateName: String,
      position: String,
      date: String,
      time: String,
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
  availability: {
    dates: [
      {
        date: { type: String, required: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
      },
    ],
  },
  bookedSlots: [
    {
      date: { type: String, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
  ],
  statistics: {
    completedInterviews: { type: Number, default: 0 },
    pendingRequests: { type: Number, default: 0 },
    totalAccepted: { type: Number, default: 0 },
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
  bankDetails: {
    bankName: String,
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    branch: String,
  },
});

export const Interviewer = mongoose.model("Interviewer", interviewerSchema);
