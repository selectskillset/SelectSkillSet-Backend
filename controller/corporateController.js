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
} from "../services/corporateService.js";

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
      message: "OTP sent to your email. Please verify to complete registration.",
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
    console.error("Error during OTP verification or registration:", error.message);
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

export const filterCandidatesByJDController = async (req, res) => {
    try {
      const skillsRequired = Array.isArray(req.body.skillsRequired)
        ? req.body.skillsRequired
        : JSON.parse(req.body.skillsRequired);
  
      const candidates = await filterCandidatesByJDService(skillsRequired);
      res.status(200).json({ candidates });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
export const bookmarkCandidate = async (req, res) => {
  try {
    const corporateId = req.user.id;
    const { candidateId } = req.body;

    if (!corporateId || !candidateId) {
      return res
        .status(400)
        .json({ error: "Corporate ID and Candidate ID are required." });
    }

    const corporate = await Corporate.findById(corporateId);
    if (!corporate) {
      return res.status(404).json({ error: "Corporate not found." });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found." });
    }

    const alreadyBookmarked = corporate.bookmarks.some(
      (bookmark) => bookmark.candidateId.toString() === candidateId
    );

    if (alreadyBookmarked) {
      corporate.bookmarks = corporate.bookmarks.filter(
        (bookmark) => bookmark.candidateId.toString() !== candidateId
      );
      await corporate.save();

      res.status(200).json({ message: "Candidate unbookmarked successfully." });
    } else {
      corporate.bookmarks.push({ candidateId });
      await corporate.save();

      res.status(200).json({ message: "Candidate bookmarked successfully." });
    }
  } catch (error) {
    console.error("Error bookmarking candidate:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getBookmarkedCandidates = async (req, res) => {
  try {
    const corporateId = req.user.id;
    const corporate = await Corporate.findById(corporateId).populate({
      path: "bookmarks.candidateId",
      select: "firstName lastName email phoneNumber countryCode location skills profilePhoto ",
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


// Unbookmark a candidate for the corporate user
export const unbookmarkCandidate = async (req, res) => {
    try {
      const corporateId = req.user.id; // Get the corporate user's ID from the authenticated session
      const { candidateId } = req.body; // Get the candidate ID from the request body
  
      if (!corporateId || !candidateId) {
        return res.status(400).json({ error: "Corporate ID and Candidate ID are required." });
      }
  
      const corporate = await Corporate.findById(corporateId); // Find the corporate user by ID
      if (!corporate) {
        return res.status(404).json({ error: "Corporate not found." });
      }
  
      // Check if the candidate is already bookmarked
      const isBookmarked = corporate.bookmarks.some(
        (bookmark) => bookmark.candidateId.toString() === candidateId
      );
  
      if (!isBookmarked) {
        return res.status(400).json({ error: "Candidate is not bookmarked." });
      }
  
      // Remove the candidate from the bookmarks list
      corporate.bookmarks = corporate.bookmarks.filter(
        (bookmark) => bookmark.candidateId.toString() !== candidateId
      );
  
      await corporate.save(); // Save the updated corporate document
  
      res.status(200).json({ message: "Candidate unbookmarked successfully." });
    } catch (error) {
      console.error("Error unbookmarking candidate:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  