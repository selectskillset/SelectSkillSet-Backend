import express from "express";
import authenticate from "../middleware/authenticate.js";

import {
  addAvailability,
  addCandidateFeedback,
  deleteAvailability,
  getAvailability,
  getInterviewerProfile,
  getInterviewerStatistics,
  getInterviewRequests,
  loginInterviewer,
  registerInterviewer,
  updateInterviewerProfile,
  updateInterviewRequest,
  verifyOtpAndRegisterInterviewer,
  getInterviewerProfileCompletion,
  rescheduleInterviewRequest, 
  approveRescheduleRequest,
  getBankDetailsController,
  updateBankDetailsController
} from "../controller/interviewerController.js";
import { upload } from "../helper/s3Upload.js";

const interviewerRoutes = express.Router();

// Register Interviewer
interviewerRoutes.post("/register", registerInterviewer);
// Verify OTP and Complete Registration
interviewerRoutes.post(
  "/verifyOtpAndRegister",
  verifyOtpAndRegisterInterviewer
);
interviewerRoutes.post("/login", loginInterviewer);
interviewerRoutes.get("/getProfile", authenticate, getInterviewerProfile);
interviewerRoutes.post("/addAvailability", authenticate, addAvailability);
interviewerRoutes.get("/getAvailability", authenticate, getAvailability);
interviewerRoutes.delete(
  "/deleteAvailability",
  authenticate,
  deleteAvailability
);
interviewerRoutes.put(
  "/updateProfile",
  authenticate,
  upload.single("profilePhoto"),
  updateInterviewerProfile
);
interviewerRoutes.get(
  "/getInterviewRequests",
  authenticate,
  getInterviewRequests
);
interviewerRoutes.put(
  "/updateInterviewRequest",
  authenticate,
  updateInterviewRequest
);
interviewerRoutes.put(
  "/rescheduleInterviewRequest",
  authenticate,
  rescheduleInterviewRequest
);

interviewerRoutes.put("/approveReschedule", approveRescheduleRequest);
interviewerRoutes.post("/add-candidate-feedback", addCandidateFeedback);
interviewerRoutes.get(
  "/get-interviewer-statistics",
  authenticate,
  getInterviewerStatistics
);

interviewerRoutes.get(
  "/profile-completion",
  authenticate,
  getInterviewerProfileCompletion
);

interviewerRoutes.get("/bank-details", authenticate, getBankDetailsController);
interviewerRoutes.post("/update-bank-details", authenticate, updateBankDetailsController);

// interviewerRoutes.delete("/profile", deleteCandidateProfile);

export default interviewerRoutes;
