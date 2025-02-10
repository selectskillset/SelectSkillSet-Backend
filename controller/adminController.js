import { sendEmail } from "../helper/emailService.js";
import { Candidate } from "../model/candidateModel.js";
import { Corporate } from "../model/corporateModel.js";
import { Interviewer } from "../model/interviewerModel.js";
import {
  createAdminService,
  deleteAdminService,
  getAllAdminService,
  getCandidatesDetailsService,
  getInterviewersDetailsService,
  getInterviewStatusesService,
  getCorporateDetailsService,
  getTotalCountsService,
  loginAdminService,
  updateAdminService,
  deleteOneCorporateService,
  deleteOneInterviewerService,
  deleteOneCandidateService,
  getOneCorporateService,
  getOneInterviewerService,
  getOneCandidateService,
} from "../services/adminServices.js";
import {
  activateAccountTemplate,
  suspendAccountTemplate,
} from "../templates/accountActionsTemplate.js";
import { deleteAccountTemplate } from "../templates/deleteAccountTemplate.js";

export const createAdminController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const admin = await createAdminService(username, email, password);

    res.status(201).json({
      message: "Admin created successfully",
      admin,
    });
  } catch (error) {
    if (error.message === "Admin already exists") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { admin, token } = await loginAdminService(email, password);

    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    if (
      error.message === "Admin not found" ||
      error.message === "Invalid email or password"
    ) {
      return res.status(401).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAdminController = async (req, res) => {
  try {
    const { id } = req.user;
    const updateData = req.body;

    const updatedAdmin = await updateAdminService(id, updateData);

    res.status(200).json({
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    if (error.message === "Admin not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteAdminController = async (req, res) => {
  try {
    const { id } = req.user;

    const result = await deleteAdminService(id);

    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Admin not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllAdminController = async (req, res) => {
  try {
    const admins = await getAllAdminService();

    res.status(200).json({
      message: "Admin details fetched successfully",
      admins,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllDetailsController = async (req, res) => {
  try {
    const candidates = await getCandidatesDetailsService();
    const interviewers = await getInterviewersDetailsService();
    const corporates = await getCorporateDetailsService();
    const { totalCandidates, totalInterviewers, totalCorporates } =
      await getTotalCountsService();
    const { pendingCount, completedCount, cancelledCount } =
      await getInterviewStatusesService();

    res.status(200).json({
      message: "Details fetched successfully",
      totalCandidates,
      totalInterviewers,
      totalCorporates,
      pendingCount,
      completedCount,
      cancelledCount,
      candidates,
      interviewers,
      corporates,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin Controller
export const getOneCandidateController = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await getOneCandidateService(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    return res.status(200).json({ success: true, data: candidate });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOneInterviewerController = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewer = await getOneInterviewerService(id);
    if (!interviewer) {
      return res.status(404).json({ message: "Interviewer not found" });
    }
    return res.status(200).json({ success: true, data: interviewer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOneCorporateController = async (req, res) => {
  try {
    const { id } = req.params;
    const corporate = await getOneCorporateService(id);
    if (!corporate) {
      return res.status(404).json({ message: "Corporate not found" });
    }
    return res.status(200).json({ success: true, data: corporate });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// candidateController.js
export const deleteOneCandidateController = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Send deletion email
    const emailSubject = "Your Candidate Account Has Been Deleted";
    const emailBody = deleteAccountTemplate(
      `${candidate.firstName} ${candidate.lastName}`,
      "candidate"
    );
    await sendEmail(candidate.email, emailSubject, "", emailBody);

    // Perform deletion
    await deleteOneCandidateService(id);

    return res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    console.error(`Deletion Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to delete candidate",
      error: error.message,
    });
  }
};

// interviewerController.js
export const deleteOneInterviewerController = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewer = await Interviewer.findById(id);

    if (!interviewer) {
      return res.status(404).json({ message: "Interviewer not found" });
    }

    // Send deletion email
    const emailSubject = "Your Interviewer Account Has Been Deleted";
    const emailBody = deleteAccountTemplate(
      `${interviewer.firstName} ${interviewer.lastName}`,
      "interviewer"
    );
    await sendEmail(interviewer.email, emailSubject, "", emailBody);

    await deleteOneInterviewerService(id);

    return res.status(200).json({
      success: true,
      message: "Interviewer deleted successfully",
    });
  } catch (error) {
    console.error(`Deletion Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to delete interviewer",
      error: error.message,
    });
  }
};

// corporateController.js
export const deleteOneCorporateController = async (req, res) => {
  try {
    const { id } = req.params;
    const corporate = await Corporate.findById(id);

    if (!corporate) {
      return res.status(404).json({ message: "Corporate not found" });
    }

    // Send deletion email
    const emailSubject = "Your Corporate Account Has Been Deleted";
    const emailBody = deleteAccountTemplate(corporate.companyName, "corporate");
    await sendEmail(corporate.contactEmail, emailSubject, "", emailBody);

    await deleteOneCorporateService(id);

    return res.status(200).json({
      success: true,
      message: "Corporate deleted successfully",
    });
  } catch (error) {
    console.error(`Deletion Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to delete corporate",
      error: error.message,
    });
  }
};

export const toggleCandidateController = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // Expect 'suspend' or 'activate', and optional 'reason'
    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    // Update suspension status based on the action
    if (action === "suspend") {
      candidate.isSuspended = true;
      // Send suspension email
      const emailSubject = "Your Account Has Been Suspended";
      const emailBody = suspendAccountTemplate(candidate.firstName, reason);
      await sendEmail(candidate.email, emailSubject, "", emailBody);
    } else if (action === "activate") {
      candidate.isSuspended = false;
      // Send activation email
      const emailSubject = "Your Account Has Been Activated";
      const emailBody = activateAccountTemplate(candidate.firstName);
      await sendEmail(candidate.email, emailSubject, "", emailBody);
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    await candidate.save();

    return res.status(200).json({
      success: true,
      message: `Candidate ${
        candidate.isSuspended ? "suspended" : "activated"
      } successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export const toggleInterviewerController = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // Expect 'suspend' or 'activate', and optional 'reason'
    const interviewer = await Interviewer.findById(id);

    if (!interviewer) {
      return res
        .status(404)
        .json({ success: false, message: "Interviewer not found" });
    }

    // Update suspension status based on the action
    if (action === "suspend") {
      interviewer.isSuspended = true;
      // Send suspension email
      const emailSubject = "Your Account Has Been Suspended";
      const emailBody = suspendAccountTemplate(interviewer.firstName, reason);
      await sendEmail(interviewer.email, emailSubject, "", emailBody);
    } else if (action === "activate") {
      interviewer.isSuspended = false;
      // Send activation email
      const emailSubject = "Your Account Has Been Activated";
      const emailBody = activateAccountTemplate(interviewer.firstName);
      await sendEmail(interviewer.email, emailSubject, "", emailBody);
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    await interviewer.save();

    return res.status(200).json({
      success: true,
      message: `Interviewer ${
        interviewer.isSuspended ? "suspended" : "activated"
      } successfully`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleCorporateController = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // Expect 'suspend' or 'activate', and optional 'reason'
    const corporate = await Corporate.findById(id);

    if (!corporate) {
      return res
        .status(404)
        .json({ success: false, message: "Corporate not found" });
    }

    // Update suspension status based on the action
    if (action === "suspend") {
      corporate.isSuspended = true;
      // Send suspension email
      const emailSubject = "Your Account Has Been Suspended";
      const emailBody = suspendAccountTemplate(corporate.contactName, reason);
      await sendEmail(corporate.email, emailSubject, "", emailBody);
    } else if (action === "activate") {
      corporate.isSuspended = false;
      // Send activation email
      const emailSubject = "Your Account Has Been Activated";
      const emailBody = activateAccountTemplate(corporate.contactName);
      await sendEmail(corporate.email, emailSubject, "", emailBody);
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    await corporate.save();

    return res.status(200).json({
      success: true,
      message: `Corporate ${
        corporate.isSuspended ? "suspended" : "activated"
      } successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
