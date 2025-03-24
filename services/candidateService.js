import bcrypt from "bcrypt";
import { Candidate } from "../model/candidateModel.js";
import generateToken from "../middleware/generateToken.js";
import { Interviewer } from "../model/interviewerModel.js";
import mongoose from "mongoose";
import { sendProfileCompletionEmail } from "../helper/sendProfileCompletionEmail.js";

export const registerCandidate = async ({ email, password, ...rest }) => {
  try {
    const candidateExist = await Candidate.findOne({ email });
    if (candidateExist) {
      throw new Error("Candidate already exists with this email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCandidate = new Candidate({
      email,
      password: hashedPassword,
      ...rest,
    });

    const savedCandidate = await newCandidate.save();

    await sendProfileCompletionEmail(savedCandidate);

    const token = generateToken(savedCandidate);

    return { token, candidateDetails: savedCandidate };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginCandidate = async (data, res) => {
  const { email, password } = data;
  const candidate = await Candidate.findOne({ email });

  if (!candidate) {
    return res
      .status(404)
      .json({ success: false, message: "Candidate not found" });
  }

  if (candidate.isSuspended) {
    return res
      .status(403)
      .json({ success: false, message: "Your account has been suspended" });
  }

  const isPasswordValid = await bcrypt.compare(password, candidate.password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = generateToken(candidate);
  const { password: _, ...candidateDetails } = candidate.toObject();
  return res.status(200).json({
    success: true,
    token,
    candidate: candidateDetails,
  });
};

export const getProfile = async (candidateId, res) => {
  const candidate = await Candidate.findById(candidateId).select("-password");
  if (!candidate) {
    return res
      .status(404)
      .json({ success: false, message: "Profile not found" });
  }
  return res.status(200).json({ success: true, profile: candidate });
};

export const updateProfile = async (candidateId, data, res) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "jobTitle",
      "location",
      "phoneNumber",
      "countryCode",
      "profilePhoto",
      "linkedIn",
      "skills",
      "resume",
      "experiences"
    ];

    // Validate allowed fields
    const updates = Object.keys(data);
    const invalidUpdates = updates.filter(
      (key) => !allowedUpdates.includes(key)
    );

    if (invalidUpdates.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid updates: ${invalidUpdates.join(", ")}`,
        validFields: allowedUpdates,
      });
    }

    // Process skills field
    if (data.skills) {
      try {
        const skills =
          typeof data.skills === "string"
            ? JSON.parse(data.skills)
            : data.skills;

        if (!Array.isArray(skills)) {
          return res.status(400).json({
            success: false,
            message: "Skills must be an array",
          });
        }

        data.skills = skills;
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid skills format - must be valid JSON array",
        });
      }
    }

    // Update candidate
    const candidate = await Candidate.findByIdAndUpdate(candidateId, data, {
      new: true,
      runValidators: true,
      context: "query",
    });

    await sendProfileCompletionEmail(candidate);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // Sanitize response
    const sanitizedCandidate = candidate.toObject();
    delete sanitizedCandidate.__v;
    delete sanitizedCandidate.createdAt;
    delete sanitizedCandidate.updatedAt;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: sanitizedCandidate,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const deleteProfile = async (candidateId, res) => {
  const candidate = await Candidate.findByIdAndDelete(candidateId);
  if (!candidate) {
    return res
      .status(404)
      .json({ success: false, message: "Profile deletion failed" });
  }
  return res
    .status(200)
    .json({ success: true, message: "Profile deleted successfully" });
};

export const importFromResume = async (candidateId, resumeData, res) => {
  const candidate = await Candidate.findByIdAndUpdate(
    candidateId,
    { "profile.resume": resumeData },
    { new: true }
  );
  if (!candidate) {
    return res.status(404).json({ success: false, message: "Import failed" });
  }
  return res.status(200).json({ success: true, updatedProfile: candidate });
};

export const importFromLinkedIn = async (candidateId, linkedInData, res) => {
  const candidate = await Candidate.findByIdAndUpdate(
    candidateId,
    { "profile.linkedIn": linkedInData },
    { new: true }
  );
  if (!candidate) {
    return res.status(404).json({ success: false, message: "Import failed" });
  }
  return res.status(200).json({ success: true, updatedProfile: candidate });
};

export const getInterviewers = async (res) => {
  try {
    // Fetch all interviewers with the required fields
    const interviewers = await Interviewer.find().select(
      "firstName lastName experience totalInterviews price profilePhoto jobTitle skills statistics bookedSlots isVerified"
    );

    // Filter interviewers based on complete information
    const filteredInterviewers = interviewers
      .filter((interviewer) => {
        return (
          interviewer.experience &&
          interviewer.price &&
          interviewer.jobTitle &&
          interviewer.skills &&
          interviewer.skills.length > 0 &&
          interviewer.statistics &&
          interviewer.statistics.completedInterviews >= 0 &&
          interviewer.statistics.averageRating >= 0
        );
      })
      .map((interviewer) => {
        // Extract relevant statistics
        const { completedInterviews, averageRating } =
          interviewer.statistics || {};

        // Return the interviewer with updated details, excluding slots
        return {
          _id: interviewer._id,
          firstName: interviewer.firstName,
          lastName: interviewer.lastName,
          experience: interviewer.experience,
          price: interviewer.price,
          profilePhoto: interviewer.profilePhoto,
          jobTitle: interviewer.jobTitle,
          isVerified: interviewer.isVerified,
          skills: interviewer.skills,
          completedInterviews: completedInterviews || 0,
          averageRating: averageRating || 0,
        };
      });

    // If no interviewers are left after filtering, return a 404 response
    if (filteredInterviewers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No interviewers found with available slots",
      });
    }

    // Return the filtered list of interviewers
    return res.status(200).json({
      success: true,
      interviewers: filteredInterviewers,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching interviewers",
    });
  }
};

// Schedule Interview Service
export const scheduleInterview = async (candidateId, data, res) => {
  try {
    const { interviewerId, date, price, from, to } = data;

    // Validate required fields
    if (!interviewerId || !date || !price || !from || !to) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (interviewerId, date, price, from, to) are required",
      });
    }

    // Find candidate and interviewer
    const [candidate, interviewer] = await Promise.all([
      Candidate.findById(candidateId),
      Interviewer.findById(interviewerId),
    ]);

    if (!candidate || !interviewer) {
      return res.status(404).json({
        success: false,
        message: !candidate ? "Candidate not found" : "Interviewer not found",
      });
    }

    // Check if the candidate has already scheduled an interview on this date
    // const isAlreadyScheduled = candidate.scheduledInterviews.some(
    //   (interview) =>
    //     new Date(interview.date).toISOString() === new Date(date).toISOString() &&
    //     interview.interviewerId.toString() === interviewerId
    // );

    // if (isAlreadyScheduled) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "An interview is already scheduled on this date.",
    //   });
    // }

    // Create interview request ID and format date
    const interviewRequestId = new mongoose.Types.ObjectId();
    const interviewDate = new Date(date);
    const dayName = interviewDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    // Update candidate's scheduled interviews
    candidate.scheduledInterviews.push({
      _id: interviewRequestId,
      interviewerId,
      date: `${dayName}, ${interviewDate.toLocaleDateString("en-US")}`,
      price,
      from,
      to,
    });
    await candidate.save();

    // Update interviewer's booked slots and interview requests
    interviewer.bookedSlots.push({ date, from, to });
    interviewer.interviewRequests.push({
      _id: interviewRequestId,
      candidateId: candidate._id,
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      position: candidate.jobTitle,
      date: `${dayName}, ${interviewDate.toLocaleDateString("en-US")}`,
      time: `${from} - ${to}`,
      from,
      to,
    });
    await interviewer.save();

    // Return success response
    return res.status(201).json({
      success: true,
      interviewRequestId,
      message: "Interview scheduled successfully.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const getScheduledInterviewsService = async (candidateId) => {
  try {
    const candidate = await Candidate.findById(candidateId).populate({
      path: "scheduledInterviews.interviewerId",
      select: "firstName lastName profilePhoto",
    });

    if (!candidate) {
      return { success: false, message: "Candidate not found" };
    }

    // Utility function to parse time with error handling
    const parseTime = (timeStr) => {
      if (!timeStr) return null;
      const timeParts = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (!timeParts) return null;

      let hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);
      const period = (timeParts[3] || "AM").toUpperCase();

      // Convert to 24-hour format
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return { hours, minutes };
    };

    // Get current time in UTC
    const currentUTC = Date.now();

    // IST offset in milliseconds (5 hours 30 minutes)
    const IST_OFFSET = 330 * 60 * 1000; // 5h30m in milliseconds

    const filteredInterviews = (candidate.scheduledInterviews || [])
      .filter((interview) => {
        try {
          if (!interview.date || !interview.from) return false;

          // Convert stored UTC date to IST date
          const utcDate = new Date(interview.date);
          const istDate = new Date(utcDate.getTime() + IST_OFFSET);
          
          // Parse time components
          const parsedTime = parseTime(interview.from);
          if (!parsedTime) return false;

          // Create IST datetime string
          const year = istDate.getUTCFullYear();
          const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
          const day = String(istDate.getUTCDate()).padStart(2, '0');
          const hours = String(parsedTime.hours).padStart(2, '0');
          const minutes = String(parsedTime.minutes).padStart(2, '0');

          // Create ISO string with IST offset
          const istDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:00+05:30`;
          
          // Convert to UTC timestamp
          const interviewDateTime = new Date(istDateTimeString);
          const interviewUTC = interviewDateTime.getTime();

          return interviewUTC > currentUTC;
        } catch (error) {
          console.error("Error processing interview:", error);
          return false;
        }
      })
      .map((interview) => {
        const interviewer = interview?.interviewerId;
        const date = interview.date ? new Date(interview.date) : null;

        // Format date in IST
        const formattedDate = date
          ? new Date(date.getTime() + IST_OFFSET).toLocaleDateString("en-IN", { 
              timeZone: "Asia/Kolkata" 
            })
          : "Date not specified";

        return {
          id: interview?._id?.toString() || "N/A",
          interviewerId: interviewer?._id?.toString() || "N/A",
          interviewerName: interviewer
            ? `${interviewer.firstName} ${interviewer.lastName}`
            : "Interviewer not available",
          interviewerPhoto: interviewer?.profilePhoto || "",
          date: formattedDate,
          from: interview.from || "Time not specified",
          to: interview.to || "Time not specified",
          status: interview.status || "Status not specified",
        };
      });

    return {
      success: true,
      interviews: filteredInterviews,
    };
  } catch (error) {
    console.error("Error in getScheduledInterviewsService:", error);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
};

export const calculateProfileCompletion = (candidate) => {
  // Validate input
  if (!candidate || typeof candidate !== "object") {
    throw new Error("Invalid candidate data provided.");
  }

  const sections = [
    {
      name: "Basic Details (Name, Email, Phone, etc.)",
      percentage: 15,
      check: () =>
        candidate.firstName &&
        candidate.lastName &&
        candidate.email &&
        candidate.phoneNumber &&
        candidate.countryCode,
      details: ["firstName", "lastName", "email", "phoneNumber", "countryCode"],
    },
    {
      name: "Profile Photo",
      percentage: 10,
      check: () => !!candidate.profilePhoto,
    },
    {
      name: "Resume Upload",
      percentage: 25,
      check: () => !!candidate.resume,
    },
    {
      name: "Work Experience",
      percentage: 20,
      check: () => !!candidate.jobTitle && !!candidate.location,
      details: ["jobTitle", "location"],
    },
    {
      name: "Skills",
      percentage: 20,
      check: () => candidate.skills && candidate.skills.length > 0,
    },
    {
      name: "LinkedIn",
      percentage: 10,
      check: () => !!candidate.linkedIn,
    },
  ];

  let totalPercentage = 0;
  const missingSections = [];

  sections.forEach((section) => {
    if (section.check()) {
      totalPercentage += section.percentage;
    } else {
      // Provide granular feedback for missing sections
      const missingDetails =
        section.details?.filter((field) => !candidate[field]) || [];
      missingSections.push({
        section: section.name,
        percentage: section.percentage,
        missingDetails,
      });
    }
  });

  return {
    totalPercentage,
    missingSections,
    isComplete: totalPercentage === 100,
  };
};
