import express from "express";
import {
  createAdminController,
  deleteAdminController,
  deleteOneCandidateController,
  deleteOneCorporateController,
  deleteOneInterviewerController,
  getAllAdminController,
  getAllDetailsController,
  getOneCandidateController,
  getOneCorporateController,
  getOneInterviewerController,
  loginController,
  toggleCandidateController,
  toggleCorporateController,
  toggleInterviewerController,
  updateAdminController,
  verifyInterviewerController,
} from "../controller/adminController.js";
import authenticate from "../middleware/authenticate.js";

const adminRoutes = express.Router();

adminRoutes.post("/login", loginController);
adminRoutes.post("/create", authenticate, createAdminController);
adminRoutes.put("/update", authenticate, updateAdminController);
adminRoutes.delete("/delete", authenticate, deleteAdminController);
adminRoutes.get("/getAll", authenticate, getAllAdminController);
adminRoutes.get("/getAll-details", authenticate, getAllDetailsController);

// GET Routes
adminRoutes.get("/getOneCandidate/:id", getOneCandidateController);
adminRoutes.get("/getOneInterviewer/:id", getOneInterviewerController);
adminRoutes.get("/getOneCorporate/:id", getOneCorporateController);

// DELETE Routes
adminRoutes.delete("/deleteOneCandidate/:id", deleteOneCandidateController);
adminRoutes.delete("/deleteOneInterviewer/:id", deleteOneInterviewerController);
adminRoutes.delete(
  "/admin/deleteOneCorporate/:id",
  deleteOneCorporateController
);

// Enable/Disable Candidate Account
adminRoutes.put("/toggleCandidate/:id", toggleCandidateController);

// Enable/Disable Interviewer Account
adminRoutes.put("/toggleInterviewer/:id", toggleInterviewerController);

// Enable/Disable Corporate Account
adminRoutes.put("/toggleCorporate/:id", toggleCorporateController);

adminRoutes.put("/verifyInterviewer/:id", verifyInterviewerController);



export default adminRoutes;
