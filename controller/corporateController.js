import { sendEmail } from "../helper/emailService.js";
import { sendOtp, verifyOtp } from "../helper/otpService.js";
import { uploadToS3 } from "../helper/s3Upload.js";
import { Candidate } from "../model/candidateModel.js";
import { Corporate } from "../model/corporateModel.js";
import {
  createCorporateService,
  updateCorporateService,
  deleteCorporateService,
  getCorporateService,
  getCandidatesByRatingService,
  filterCandidatesByJDService,
  corporateLoginService,
  getOneCandidateService,
} from "../services/corporateService.js";
import { bookmarkEmailTemplate } from "../templates/bookmarkEmailTemplate.js";

export const corporateLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { corporate, token } = await corporateLoginService(email, password);

    res.status(200).json({
      message: "Login successful",
      corporate,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Register Corporate (Send OTP)
export const registerCorporate = async (req, res) => {
  try {
    const { email } = req.body;

    const existingCorporate = await Corporate.findOne({ email });
    if (existingCorporate) {
      console.log("Corporate already exists:", existingCorporate.email);
      return res.status(400).json({
        success: false,
        message: "Corporate already exists. Please log in.",
      });
    }

    // Send OTP to the email
    await sendOtp(email);

    return res.status(200).json({
      success: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error("Error during corporate registration:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

// Verify OTP and Complete Registration
export const verifyOtpAndRegisterCorporate = async (req, res) => {
  try {
    console.log("Received payload:", req.body); // Log the payload
    const { otp, email, password, ...rest } = req.body;

    // Verify OTP
    verifyOtp(email, otp);
    console.log("OTP verified successfully for email:", email);

    // Create the corporate account
    const corporate = await createCorporateService({
      email,
      password,
      ...rest,
    });
    console.log("Corporate account created successfully:", corporate);

    return res.status(201).json({
      success: true,
      message: "Corporate created successfully",
      corporate,
    });
  } catch (error) {
    console.error(
      "Error during OTP verification or registration:",
      error.message
    );
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to verify OTP or register corporate.",
    });
  }
};

export const updateCorporateController = async (req, res) => {
  try {
    const { id } = req.user;
    const updateData = { ...req.body };

    // If a file is uploaded, upload it to S3 and add the URL to updateData
    if (req.file) {
      const fileUrl = await uploadToS3(req.file, "profile-photos"); // Folder name for profile photos
      updateData.profilePhoto = fileUrl;
    }

    // Update the corporate profile
    const corporate = await updateCorporateService(id, updateData);

    res.status(200).json({
      message: "Corporate updated successfully",
      corporate,
    });
  } catch (error) {
    const statusCode = error.message === "Corporate not found" ? 404 : 500;
    res.status(statusCode).json({
      message: error.message || "Server error",
      error: error.message,
    });
  }
};

export const deleteCorporateController = async (req, res) => {
  try {
    const { id } = req.user;
    await deleteCorporateService(id);
    res.status(200).json({ message: "Corporate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCorporateController = async (req, res) => {
  try {
    const { id } = req.user;
    const corporate = await getCorporateService(id);
    res.status(200).json({ corporate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCandidatesByRatingController = async (req, res) => {
  try {
    const candidates = await getCandidatesByRatingService();
    res.status(200).json({ candidates });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getOneCandidateController = async (req, res) => {
  const corporateId = req.user.id;
  const { id } = req.params;
  try {
    const candidates = await getOneCandidateService(id,corporateId);
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const filterCandidatesByJDController = async (req, res) => {
  try {
    const { title, description, skillsRequired, matchStrength } = req.body;
    
    const skills = Array.isArray(skillsRequired) 
      ? skillsRequired 
      : skillsRequired ? [skillsRequired] : [];
    
    const candidates = await filterCandidatesByJDService(
      title, 
      description, 
      skills, 
      matchStrength || "high"
    );
    
    res.status(200).json({ candidates });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const bookmarkCandidate = async (req, res) => {
  try {
    const { id } = req.user; // Corporate ID
    const { candidateId } = req.body;

    // Validate input
    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required",
      });
    }

    // Find corporate and candidate
    const [corporate, candidate] = await Promise.all([
      Corporate.findById(id),
      Candidate.findById(candidateId),
    ]);

    if (!corporate || !candidate) {
      return res.status(404).json({
        success: false,
        message: "Corporate or Candidate not found",
      });
    }

    // Check if already bookmarked
    const isBookmarked = corporate.bookmarks.some(
      (b) => b.candidateId.toString() === candidateId
    );
    if (isBookmarked) {
      return res.status(400).json({
        success: false,
        message: "Candidate already bookmarked",
      });
    }

    // Add bookmark
    corporate.bookmarks.push({ candidateId });
    await corporate.save();

    // Send email notification
    try {
      // Generate email content using the template
      const emailContent = bookmarkEmailTemplate(
        candidate.email,
        `${candidate.firstName} ${candidate.lastName}`,
        corporate.companyName
      );

      // Pass individual fields to sendEmail
      await sendEmail(
        emailContent.to,
        emailContent.subject,
        null,
        emailContent.html
      );
    } catch (emailError) {
      console.error(" Email sending failed:", emailError.message);
      // Continue even if email fails
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Candidate bookmarked successfully",
      bookmarks: corporate.bookmarks,
    });
  } catch (error) {
    console.error(" Bookmark error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const unbookmarkCandidate = async (req, res) => {
  try {
    const { id } = req.user;
    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required",
      });
    }

    const corporate = await Corporate.findById(id);
    if (!corporate) {
      return res.status(404).json({
        success: false,
        message: "Corporate not found",
      });
    }

    // Remove bookmark
    const initialLength = corporate.bookmarks.length;
    corporate.bookmarks = corporate.bookmarks.filter(
      (b) => b.candidateId.toString() !== candidateId
    );

    if (initialLength === corporate.bookmarks.length) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    await corporate.save();

    res.status(200).json({
      success: true,
      message: "Candidate unbookmarked successfully",
      bookmarks: corporate.bookmarks,
    });
  } catch (error) {
    console.error("Unbookmark error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getBookmarkedCandidates = async (req, res) => {
  try {
    const corporateId = req.user.id;
    const corporate = await Corporate.findById(corporateId).populate({
      path: "bookmarks.candidateId",
      select:
        "firstName lastName location profilePhoto skills statistics.averageRating",
    });

    if (!corporate) {
      return res
        .status(404)
        .json({ success: false, message: "Corporate not found." });
    }

    const bookmarkedCandidates = corporate.bookmarks.map((bookmark) => ({
      candidate: bookmark.candidateId,
      bookmarkedAt: bookmark.createdAt,
    }));

    res.status(200).json({ success: true, bookmarkedCandidates });
  } catch (error) {
    console.error("Error fetching bookmarked candidates:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
