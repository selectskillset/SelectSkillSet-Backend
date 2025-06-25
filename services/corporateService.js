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
    hasAcceptedTerms,
    hasAcceptedPrivacyPolicy,
    gdprConsent,
  } = data;

  // Validate required fields
  if (
    !contactName ||
    !email ||
    !password ||
    !countryCode ||
    !phoneNumber ||
    !companyName ||
    !hasAcceptedTerms ||
    !hasAcceptedPrivacyPolicy ||
    !gdprConsent
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
    hasAcceptedTerms,
    hasAcceptedPrivacyPolicy,
    gdprConsent,
  });

  await corporate.save();
  return corporate;
};

export const updateCorporateService = async (id, data) => {
  try {
    const updateData = { ...data };

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
    ).select("-password -__v"); 

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
      "firstName lastName email countryCode jobTitle phoneNumber location profilePhoto linkedIn skills statistics.averageRating statistics.feedbacks resume"
    );
};
export const getOneCandidateService = async (id, corporateId) => {
  try {
    // Validate input
    if (!id) {
      throw new Error("Candidate ID is required");
    }

    // Fetch candidate data with lean() for better performance
    const candidate = await Candidate.findById(id)
      .select(
        "firstName lastName email countryCode phoneNumber location profilePhoto linkedIn skills statistics.averageRating statistics.feedbacks resume scheduledInterviews experiences"
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

      return scheduledInterview
        ? {
            ...feedback,
            date: scheduledInterview.date,
            from: scheduledInterview.from,
            to: scheduledInterview.to,
          }
        : feedback;
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
        feedbacks: enrichedFeedbacks,
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

export const filterCandidatesByJDService = async (title, description, skillsRequired, matchStrength) => {
  try {
    // Extract keywords from job description
    const descriptionKeywords = extractKeywords(description);
    
    // Combine all search terms
    const allSearchTerms = [
      ...(title ? [title.toLowerCase()] : []),
      ...skillsRequired.map(skill => skill.toLowerCase()),
      ...descriptionKeywords
    ];
    
    // Create a unique set of search terms
    const searchTerms = [...new Set(allSearchTerms)];
    
    if (searchTerms.length === 0) {
      return [];
    }
    
    // Build the query based on match strength
    let query = {};
    
    if (matchStrength === "high") {
      // High match: Must match all criteria
      query = {
        $and: [
          ...(title ? [{
            jobTitle: { $regex: title, $options: 'i' }
          }] : []),
          ...(skillsRequired.length > 0 ? [{
            skills: { $all: skillsRequired.map(skill => new RegExp(skill, 'i')) }
          }] : []),
          ...(descriptionKeywords.length > 0 ? [{
            $or: [
              { jobTitle: { $in: descriptionKeywords.map(keyword => new RegExp(keyword, 'i')) } },
              { skills: { $in: descriptionKeywords.map(keyword => new RegExp(keyword, 'i')) } }
            ]
          }] : [])
        ].filter(Boolean)
      };
    } else if (matchStrength === "medium") {
      // Medium match: Must match at least 2 criteria
      const conditions = [
        ...(title ? [{ jobTitle: { $regex: title, $options: 'i' } }] : []),
        ...(skillsRequired.length > 0 ? [{ 
          skills: { $in: skillsRequired.map(skill => new RegExp(skill, 'i')) } 
        }] : []),
        ...(descriptionKeywords.length > 0 ? [{
          $or: [
            { jobTitle: { $in: descriptionKeywords.map(keyword => new RegExp(keyword, 'i')) } },
            { skills: { $in: descriptionKeywords.map(keyword => new RegExp(keyword, 'i')) } }
          ]
        }] : [])
      ].filter(Boolean);
      
      query = {
        $and: [
          { $or: conditions },
          { 
            $expr: { 
              $gte: [
                { $size: { $setIntersection: [ 
                  ["$jobTitle", ...(skillsRequired || [])], 
                  searchTerms 
                ] } },
                2
              ] 
            } 
          }
        ]
      };
    } else {
      // Low match: Match any criteria
      query = {
        $or: [
          ...(title ? [{ jobTitle: { $regex: title, $options: 'i' } }] : []),
          ...(skillsRequired.length > 0 ? [{ 
            skills: { $in: skillsRequired.map(skill => new RegExp(skill, 'i')) } 
          }] : []),
          ...(descriptionKeywords.length > 0 ? [{
            $or: [
              { jobTitle: { $in: descriptionKeywords.map(keyword => new RegExp(keyword, 'i')) } },
              { skills: { $in: descriptionKeywords.map(keyword => new RegExp(keyword, 'i')) } }
            ]
          }] : [])
        ].filter(Boolean)
      };
    }
    
    return await Candidate.find(query).select(
      "firstName lastName email phoneNumber jobTitle location profilePhoto linkedIn skills statistics.averageRating statistics.feedbacks resume"
    ).limit(50);
  } catch (error) {
    throw new Error(`Filtering error: ${error.message}`);
  }
};

const extractKeywords = (text) => {
  if (!text) return [];
  
  // Common words to exclude
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 
    'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'as', 'it', 'that', 
    'this', 'these', 'those', 'then', 'than', 'when', 'where', 'how', 'what', 'which', 
    'who', 'whom', 'why', 'will', 'would', 'can', 'could', 'shall', 'should', 'may', 
    'might', 'must', 'here', 'there', 'from', 'out', 'over', 'under', 'up', 'down'
  ]);
  
  // Extract words and filter out stop words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  // Return unique words
  return [...new Set(words)];
};