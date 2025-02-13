import generateToken from "../middleware/generateToken.js";
import bcrypt from "bcrypt";

import { Interviewer } from "../model/interviewerModel.js";
import { uploadToS3 } from "../helper/s3Upload.js";

export const createInterviewerService = async (data) => {
  const { firstName, lastName, email, password, countryCode, phoneNumber } =
    data;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !countryCode ||
    !phoneNumber
  ) {
    throw new Error("Missing required fields");
  }

  // Check if interviewer already exists
  const existingInterviewer = await Interviewer.findOne({ email });
  if (existingInterviewer) {
    throw new Error("Interviewer already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the interviewer document
  const interviewer = new Interviewer({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    countryCode,
    phoneNumber,
  });

  // Save the interviewer to the database
  await interviewer.save();
  return interviewer;
};

export const loginInterviewerService = async (data, res) => {
  const { email, password } = data;
  const interviewer = await Interviewer.findOne({ email });

  if (!interviewer) {
    return res
      .status(404)
      .json({ success: false, message: "Interviewer not found" });
  }

  if (interviewer.isSuspended) {
    return res
      .status(403)
      .json({ success: false, message: "Your account has been suspended" });
  }

  const isPasswordValid = await bcrypt.compare(password, interviewer.password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = generateToken(interviewer);
  const { password: _, ...interviewerDetails } = interviewer.toObject();
  return res.status(200).json({
    success: true,
    token,
    interviewer: interviewerDetails,
  });
};

export const getInterviewerProfileServices = async (interviewerId, res) => {
  const interviewer = await Interviewer.findById(interviewerId).select(
    "-password"
  );
  if (!interviewer) {
    return res
      .status(404)
      .json({ success: false, message: "Profile not found" });
  }
  return res.status(200).json({ success: true, profile: interviewer });
};
export const getAvailabilityServices = async (interviewerId) => {
  const interviewer = await Interviewer.findById(interviewerId).select(
    "availability.dates"
  );

  if (
    !interviewer ||
    !interviewer.availability ||
    !interviewer.availability.dates
  ) {
    throw new Error("Availability not found");
  }

  return interviewer.availability.dates;
};

export const updateInterviewerProfileServices = async (
  interviewerId,
  data,
  file
) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "jobTitle",
      "location",
      "phoneNumber",
      "countryCode",
      "experience",
      "price",
      "skills",
    ];

    // Parse skills if needed
    if (data.skills && typeof data.skills === "string") {
      data.skills = JSON.parse(data.skills);
    }

    // Filter valid updates
    const filteredData = Object.keys(data)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => ((obj[key] = data[key]), obj), {});

    // Handle file upload
    if (file) {
      if (!file.buffer) throw new Error("Invalid file format");
      filteredData.profilePhoto = await uploadToS3(file, "profile-photos");
    }

    if (Object.keys(filteredData).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    return await Interviewer.findByIdAndUpdate(interviewerId, filteredData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    console.error("Update error:", error);
    throw error; // Throw instead of handling response
  }
};
