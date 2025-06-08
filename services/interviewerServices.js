import generateToken from "../middleware/generateToken.js";
import bcrypt from "bcrypt";

import { Interviewer } from "../model/interviewerModel.js";
import { uploadToS3 } from "../helper/s3Upload.js";
import { calculateExperience } from "../helper/calculateExperience.js";

export const createInterviewerService = async (data) => {
  const {
    firstName,
    lastName,
    email,
    password,
    countryCode,
    phoneNumber,
    hasAcceptedTerms,
    hasAcceptedPrivacyPolicy,
    gdprConsent,
    hasExperience,
  } = data;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !countryCode ||
    !phoneNumber ||
    !hasAcceptedTerms ||
    !hasAcceptedPrivacyPolicy ||
    !gdprConsent ||
    !hasExperience
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
    hasAcceptedTerms,
    hasAcceptedPrivacyPolicy,
    gdprConsent,
    hasExperience,
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
    "-password -bankDetails -bookedSlots -hasAcceptedTerms -availability -interviewRequests -isSuspended"
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
      "profilePhoto",
      "lastName",
      "jobTitle",
      "location",
      "summary",
      "phoneNumber",
      "countryCode",
      "experience",
      "experiences",
      "price",
      "skills",
    ];

    // Safely parse JSON fields
    if (data.experiences && typeof data.experiences === "string") {
      try {
        data.experiences = JSON.parse(data.experiences);
      } catch (error) {
        throw new Error(
          "Invalid experiences format. Expected valid JSON array."
        );
      }
    }
    if (data.skills && typeof data.skills === "string") {
      try {
        data.skills = JSON.parse(data.skills);
      } catch (error) {
        throw new Error("Invalid skills format. Expected valid JSON array.");
      }
    }

    // Filter valid updates
    const filteredData = Object.keys(data)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => ((obj[key] = data[key]), obj), {});

    // Process experiences to calculate total experience
    let totalYears = 0,
      totalMonths = 0;
    if (filteredData.experiences && Array.isArray(filteredData.experiences)) {
      filteredData.experiences = filteredData.experiences.map((exp) => {
        if (!exp.startDate) return { ...exp, totalExperience: "0 yrs 0 mo" };

        const { years, months, total } = calculateExperience(
          exp.startDate,
          exp.current ? null : exp.endDate
        );

        totalYears += years;
        totalMonths += months;

        return { ...exp, totalExperience: total };
      });

      // Adjust total experience
      totalYears += Math.floor(totalMonths / 12);
      totalMonths %= 12;
      filteredData.experience = `${totalYears} yrs ${totalMonths} mo`;
    }

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
    throw error;
  }
};

export const calculateInterviewerProfileCompletion = (interviewer) => {
  const sections = [
    {
      name: "Basic Details (Name, Email, Phone, etc.)",
      percentage: 20,
      check: () =>
        interviewer.firstName &&
        interviewer.email &&
        interviewer.phoneNumber &&
        interviewer.countryCode,
    },
    {
      name: "Profile Photo",
      percentage: 10,
      check: () => interviewer.profilePhoto,
    },
    {
      name: "Job Title",
      percentage: 10,
      check: () => interviewer.jobTitle,
    },
    {
      name: "Experience",
      percentage: 15,
      check: () => interviewer.experience,
    },
    {
      name: "Skills",
      percentage: 15,
      check: () => interviewer.skills && interviewer.skills.length > 0,
    },
    {
      name: "Price",
      percentage: 10,
      check: () => interviewer.price,
    },
    {
      name: "Availability",
      percentage: 20,
      check: () =>
        interviewer.availability &&
        interviewer.availability.dates &&
        interviewer.availability.dates.length > 0,
    },
  ];

  let totalPercentage = 0;
  const missingSections = [];

  sections.forEach((section) => {
    if (section.check()) {
      totalPercentage += section.percentage;
    } else {
      missingSections.push({
        section: section.name,
        percentage: section.percentage,
      });
    }
  });

  return {
    totalPercentage,
    missingSections,
    isComplete: totalPercentage === 100,
  };
};
