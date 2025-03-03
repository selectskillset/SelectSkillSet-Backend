import bcrypt from "bcrypt";
import generateToken from "../middleware/generateToken.js";
import { Corporate } from "../model/corporateModel.js";
import { Candidate } from "../model/candidateModel.js";

export const corporateLoginService = async (email, password) => {
  const corporate = await Corporate.findOne({ email });

  if (!corporate) {
    throw new Error("Corporate not found");
  }

  if (corporate.isSuspended) {
    throw new Error("Your account has been suspended");
  }

  const isPasswordValid = await bcrypt.compare(password, corporate.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(corporate);
  return {
    corporate: {
      id: corporate._id,
      contactName: corporate.contactName,
      email: corporate.email,
      companyName: corporate.companyName,
      location: corporate.location,
    },
    token,
  };
};

export const createCorporateService = async (data) => {
  const {
    contactName,
    email,
    password,
    countryCode,
    phoneNumber,
    companyName,
    location,
    industry,
  } = data;

  // Validate required fields
  if (
    !contactName ||
    !email ||
    !password ||
    !countryCode ||
    !phoneNumber ||
    !companyName
  ) {
    throw new Error("Missing required fields");
  }

  // Check if corporate already exists
  const existingCorporate = await Corporate.findOne({ email });
  if (existingCorporate) {
    throw new Error("Corporate already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the corporate document
  const corporate = new Corporate({
    contactName,
    email,
    password: hashedPassword,
    countryCode,
    phoneNumber,
    companyName,
    location,
    industry,
  });

  // Save the corporate to the database
  await corporate.save();
  return corporate;
};

export const updateCorporateService = async (id, data) => {
  try {
    const updateData = { ...data };

    // If profilePhoto is provided, ensure it's a string (URL)
    if (
      updateData.profilePhoto &&
      typeof updateData.profilePhoto !== "string"
    ) {
      throw new Error("Invalid profile photo data");
    }

    const updatedCorporate = await Corporate.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -__v"); // Exclude sensitive fields

    if (!updatedCorporate) {
      throw new Error("Corporate not found");
    }

    return updatedCorporate;
  } catch (error) {
    console.error("Update Corporate Service Error:", error);
    throw new Error(error.message || "Failed to update corporate profile");
  }
};

export const deleteCorporateService = async (id) => {
  const deletedCorporate = await Corporate.findByIdAndDelete(id);
  if (!deletedCorporate) {
    throw new Error("Corporate not found");
  }
  return deletedCorporate;
};

export const getCorporateService = async (id) => {
  const corporate = await Corporate.findById(id).select("-password");
  if (!corporate) {
    throw new Error("Corporate not found");
  }
  return corporate;
};

// Get Candidates Sorted by Rating
export const getCandidatesByRatingService = async () => {
  return await Candidate.find()
    .sort({ "statistics.averageRating": -1 })
    .select(
      "firstName lastName email countryCode phoneNumber location profilePhoto linkedIn skills statistics.averageRating statistics.feedbacks resume"
    );
};
export const getOneCandidateService = async (id,corporateId) => {
  try {
    // Validate input
    if (!id) {
      throw new Error("Candidate ID is required");
    }

    // Fetch candidate data with lean() for better performance
    const candidate = await Candidate.findById(id)
      .select(
        "firstName lastName email countryCode phoneNumber location profilePhoto linkedIn skills statistics.averageRating statistics.feedbacks resume scheduledInterviews"
      )
      .lean();

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    const enrichedFeedbacks = candidate.statistics.feedbacks.map((feedback) => {
      if (!feedback.interviewRequestId) {
        return feedback;
      }

      const scheduledInterview = candidate.scheduledInterviews.find(
        (interview) => 
          interview._id.toString() === feedback.interviewRequestId.toString()
      );

      return scheduledInterview ? {
        ...feedback,
        date: scheduledInterview.date,
        from: scheduledInterview.from,
        to: scheduledInterview.to,
      } : feedback;
    });


    // Check if the candidate is bookmarked by the corporate user
    let isBookmarked = false;
    if (corporateId) {
      const corporate = await Corporate.findOne({
        _id: corporateId,
        "bookmarks.candidateId": id,
      });
      isBookmarked = !!corporate; // Set to true if corporate has bookmarked the candidate
    }

    const response = {
      ...candidate,
      statistics: {
        ...candidate.statistics,
        feedbacks: enrichedFeedbacks
      },
      isBookmarked,
    };
    delete response.scheduledInterviews;

    

    return response;
  } catch (error) {
    throw error instanceof Error 
      ? error 
      : new Error(`Failed to fetch candidate: ${error}`);
  }
};

export const filterCandidatesByJDService = async (skillsRequired) => {
  return await Candidate.find({
    skills: { $in: skillsRequired },
  }).select(
    "firstName lastName email phoneNumber countryCode location profilePhoto linkedIn skills statistics.averageRating statistics.feedbacks resume"
  );
};
