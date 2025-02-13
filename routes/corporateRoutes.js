import express from "express";
import {
  updateCorporateController,
  deleteCorporateController,
  getCorporateController,
  getCandidatesByRatingController,
  filterCandidatesByJDController,
  corporateLoginController,
  bookmarkCandidate,
  getBookmarkedCandidates,
  unbookmarkCandidate,
  registerCorporate,
  verifyOtpAndRegisterCorporate,
} from "../controller/corporateController.js";
import authenticate from "../middleware/authenticate.js";
import { upload } from "../helper/s3Upload.js";

const corporateRoutes = express.Router();

// Register Corporate
corporateRoutes.post("/register", registerCorporate);

// Verify OTP and Register Corporate
corporateRoutes.post("/verifyOtpAndRegister", verifyOtpAndRegisterCorporate);
corporateRoutes.post("/login", corporateLoginController);
corporateRoutes.put(
  "/updateProfile",
  authenticate,
  upload.single("profilePhoto"),
  updateCorporateController
);
corporateRoutes.delete("/delete", deleteCorporateController);
corporateRoutes.get("/getProfile", authenticate, getCorporateController);
corporateRoutes.get("/getAllCandidates", getCandidatesByRatingController);
corporateRoutes.post("/candidates/filter", filterCandidatesByJDController);
corporateRoutes.post("/bookmarkCandidate", authenticate, bookmarkCandidate);
corporateRoutes.post("/unbookmarkCandidate", authenticate, unbookmarkCandidate);
corporateRoutes.get(
  "/getBookmarkedCandidates",
  authenticate,
  getBookmarkedCandidates
);

export default corporateRoutes;
