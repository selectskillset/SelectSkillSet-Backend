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
      "firstName lastName email countryCode phoneNumber location profilePhoto linkedIn skills statistics.averageRating resume"
    );
};
export const getOneCandidateService = async (id) => {
  return await Candidate.findById(id)
  .select(
    "firstName lastName email countryCode phoneNumber location profilePhoto linkedIn skills statistics.averageRating resume"
  );
};

export const filterCandidatesByJDService = async (skillsRequired) => {
  return await Candidate.find({
    skills: { $in: skillsRequired },
  }).select(
    "firstName lastName email phoneNumber countryCode location profilePhoto linkedIn skills statistics.averageRating resume"
  );
};
