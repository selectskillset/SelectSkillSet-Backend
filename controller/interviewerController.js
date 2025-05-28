import { Interviewer } from "../model/interviewerModel.js";
import { Candidate } from "../model/candidateModel.js";
import {
  calculateInterviewerProfileCompletion,
  createInterviewerService,
  getInterviewerProfileServices,
  loginInterviewerService,
  updateInterviewerProfileServices,
} from "../services/interviewerServices.js";
import dotenv from "dotenv";
import { sendEmail } from "../helper/emailService.js";
import {
  interviewerTemplate,
  rescheduleInterviewerTemplate,
} from "../templates/interviewerTemplate.js";
import {
  candidateTemplate,
  rescheduleCandidateTemplate,
} from "../templates/candidateTemplate.js";
import { candidateFeedbackTemplate } from "../templates/candidateFeedbackTemplate.js";
import { sendOtp, verifyOtp } from "../helper/otpService.js";
import { isSlotExpired } from "../utils/slotUtils.js";
import { rescheduleRequestTemplate } from "../templates/rescheduleRequestTemplate.js";
import mongoose from "mongoose";
import { decrypt, encrypt } from "../helper/bankDetailsEncryption.js";

dotenv.config();

const url = process.env.WEBSITE_URL;
export const registerInterviewer = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the interviewer already exists
    const existingInterviewer = await Interviewer.findOne({ email });
    if (existingInterviewer) {
      return res.status(400).json({
        success: false,
        message: "Interviewer already exists. Please log in.",
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
    console.error("Error during interviewer registration:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

export const verifyOtpAndRegisterInterviewer = async (req, res) => {
  try {
    console.log("Received payload:", req.body); // Log the payload
    const { otp, email, password, ...rest } = req.body;

    // Verify OTP
    verifyOtp(email, otp);
    console.log("OTP verified successfully for email:", email);

    // Create the interviewer account
    const interviewer = await createInterviewerService({
      email,
      password,
      ...rest,
    });

    console.log("Interviewer account created successfully:", interviewer);
    return res.status(201).json({
      success: true,
      message: "Interviewer created successfully",
      interviewer,
    });
  } catch (error) {
    console.error(
      "Error during OTP verification or registration:",
      error.message
    );
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to verify OTP or register interviewer.",
    });
  }
};

export const loginInterviewer = async (req, res) => {
  try {
    await loginInterviewerService(req.body, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInterviewerProfile = async (req, res) => {
  try {
    await getInterviewerProfileServices(req.user.id, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addAvailability = async (req, res) => {
  try {
    const { dates } = req.body;
    if (!dates?.length) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid availability dates",
      });
    }

    const interviewer = await Interviewer.findById(req.user.id);
    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    // Add new slots (prevent duplicates)
    dates.forEach((newSlot) => {
      const exists = interviewer.availability.dates.some(
        (slot) =>
          slot.date === newSlot.date &&
          slot.from === newSlot.from &&
          slot.to === newSlot.to
      );
      if (!exists) interviewer.availability.dates.push(newSlot);
    });

    // Remove expired slots
    interviewer.availability.dates = interviewer.availability.dates.filter(
      (slot) => !isSlotExpired(slot)
    );

    await interviewer.save();

    res.status(200).json({
      success: true,
      availability: interviewer.availability.dates.map((slot) => ({
        _id: slot._id,
        date: slot.date,
        from: slot.from,
        to: slot.to,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAvailability = async (req, res) => {
  const { id } = req.body; // Use id instead of date

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Availability ID is required" });
  }

  try {
    const result = await Interviewer.updateOne(
      { "availability.dates._id": id }, // Match by _id
      { $pull: { "availability.dates": { _id: id } } } // Pull the availability with that id
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No availability found for the provided ID`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Availability deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const interviewer = await Interviewer.findById(req.user.id).select(
      "availability"
    );

    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    // Filter out expired slots
    const validSlots = interviewer.availability.dates.filter(
      (slot) => !isSlotExpired(slot)
    );

    res.status(200).json({
      success: true,
      availability: validSlots.map((slot) => ({
        _id: slot._id,
        date: slot.date,
        from: slot.from,
        to: slot.to,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateInterviewerProfile = async (req, res) => {
  try {
    const updatedProfile = await updateInterviewerProfileServices(
      req.user.id,
      req.body,
      req.file
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    res.status(200).json({
      success: true,
      updatedProfile,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const formatDateTime = (date, from, to) => {
  const options = {
    weekday: "long", // Day of the week
    year: "numeric",
    month: "numeric", // Numeric month
    day: "numeric", // Numeric day
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short", // Include time zone info
  };

  const formattedDate = new Date(date).toLocaleString("en-US", options);

  // Convert start and end time to GMT
  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}Z`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "GMT",
    });
  };

  const formattedFromTime = from ? formatTime(from) : "N/A";
  const formattedToTime = to ? formatTime(to) : "N/A";

  return {
    formattedDate,
    formattedFromTime,
    formattedToTime,
  };
};

export const getInterviewRequests = async (req, res) => {
  try {
    const interviewer = await Interviewer.findById(req.user.id).populate(
      "interviewRequests.candidateId",
      "firstName lastName profilePhoto skills resume"
    );

    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    // IST offset in milliseconds (5 hours 30 minutes)
    const IST_OFFSET = 330 * 60 * 1000;

    const parseTime = (timeStr) => {
      if (!timeStr) return null;
      const timeParts = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (!timeParts) return null;

      let hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);
      const period = (timeParts[3] || "AM").toUpperCase();

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return { hours, minutes };
    };

    // Get current UTC timestamp
    const currentUTC = Date.now();

    const formattedRequests = interviewer.interviewRequests
      .map((request) => {
        try {
          if (!request.date || !request.time) return null;

          // Convert stored UTC date to IST
          const utcDate = new Date(request.date);
          const istDate = new Date(utcDate.getTime() + IST_OFFSET);

          // Parse time from request
          const parsedTime = parseTime(request.time.split(" - ")[1]); // Get end time
          if (!parsedTime) return null;

          // Create IST datetime string
          const year = istDate.getUTCFullYear();
          const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
          const day = String(istDate.getUTCDate()).padStart(2, "0");
          const hours = String(parsedTime.hours).padStart(2, "0");
          const minutes = String(parsedTime.minutes).padStart(2, "0");

          // Create ISO string with IST offset
          const istDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:00+05:30`;
          const endDateTime = new Date(istDateTimeString).getTime();

          // Filter out past interviews
          if (endDateTime <= currentUTC) return null;

          // Format display date in IST
          const formattedDate = new Date(
            utcDate.getTime() + IST_OFFSET
          ).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return {
            id: request._id,
            name: `${request.candidateId?.firstName || "Unknown"} ${
              request.candidateId?.lastName?.charAt(0) || ""
            }`.trim(),
            profilePhoto:
              request.candidateId?.profilePhoto || "/default-avatar.jpg",
            resume: request.candidateId?.resume,
            skills: request.candidateId?.skills || [],
            position: request.position || "Position not specified",
            date: formattedDate,
            time: request.time, // Keep original time format
            status: request.status,
          };
        } catch (error) {
          console.error("Error processing request:", error);
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return res.status(200).json({
      success: true,
      interviewRequests: formattedRequests,
    });
  } catch (error) {
    console.error("Error fetching interview requests:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const updateInterviewRequest = async (req, res) => {
  try {
    const { interviewRequestId, status } = req.body;

    if (!interviewRequestId || !status) {
      return res.status(400).json({
        success: false,
        message: "Interview request ID and status are required",
      });
    }

    if (!["Approved", "Cancelled", "RescheduleRequested"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Only 'Approved' or 'Cancelled'  are allowed.",
      });
    }

    const updateResult = await Interviewer.updateOne(
      { "interviewRequests._id": interviewRequestId },
      {
        $set: {
          "interviewRequests.$.status": status,
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Interview request not found in Interviewer model",
      });
    }

    const candidateUpdateResult = await Candidate.updateOne(
      { "scheduledInterviews._id": interviewRequestId },
      {
        $set: {
          "scheduledInterviews.$.status": status,
        },
      }
    );

    if (candidateUpdateResult.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Interview request not found in Candidate model",
      });
    }

    if (status === "Approved") {
      const googleMeetLinks = [
        "https://meet.google.com/xbn-baxk-deo",
        "https://meet.google.com/xbn-baxk-deo",
      ];
      const meetLink =
        googleMeetLinks[Math.floor(Math.random() * googleMeetLinks.length)];

      const interviewer = await Interviewer.findOne(
        { "interviewRequests._id": interviewRequestId },
        { email: 1, firstName: 1, "interviewRequests.$": 1 }
      );

      if (!interviewer || !interviewer.email) {
        return res.status(404).json({
          success: false,
          message: "Interviewer not found or email is missing.",
        });
      }

      const interviewRequest = interviewer.interviewRequests[0];

      if (
        !interviewRequest ||
        !interviewRequest.date ||
        !interviewRequest.time
      ) {
        return res.status(400).json({
          success: false,
          message: "Incomplete interview request data (date or time missing).",
        });
      }

      const candidate = await Candidate.findById(interviewRequest.candidateId);

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found",
        });
      }

      const [emailFromTime, emailToTime] = interviewRequest.time.split(" - ");
      const rawDate = new Date(interviewRequest.date).toDateString();
      const emailDate = rawDate.replace(/GMT.*$/, "GMT");

      const date = `${emailDate} `;
      const time = `from ${emailFromTime} to ${emailToTime}`;

      const interviewerEmail = interviewerTemplate(
        interviewer.firstName,
        candidate.firstName,
        date,
        time,
        meetLink,
        interviewRequest._id,
        candidate._id,
        url
      );

      const candidateEmail = candidateTemplate(
        candidate.firstName,
        date,
        time,
        meetLink,
        interviewRequest._id,
        interviewer._id,
        url
      );

      try {
        await sendEmail(
          interviewer.email,
          "Interview Scheduled",
          "",
          interviewerEmail
        );
        console.log("Interviewer email sent successfully.");

        await sendEmail(
          candidate.email,
          "Interview Scheduled",
          "",
          candidateEmail
        );
        console.log("Candidate email sent successfully.");
      } catch (emailError) {
        console.error("Error sending emails:", emailError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Interview request ${
        status === "Approved" ? "approved" : "cancelled"
      } successfully`,
    });
  } catch (error) {
    console.error("Error updating interview request:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addCandidateFeedback = async (req, res) => {
  const { candidateId, interviewRequestId, feedback } = req.body;

  if (!candidateId || !interviewRequestId || !feedback) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    const interviewIndex = candidate.scheduledInterviews.findIndex(
      (i) => i._id.toString() === interviewRequestId
    );

    if (interviewIndex === -1) {
      return res.status(404).json({ message: "Interview request not found." });
    }

    // Update status
    candidate.scheduledInterviews[interviewIndex].status = "Completed";
    candidate.markModified("scheduledInterviews");

    const candidateName = candidate.firstName;

    const existingFeedback = candidate.statistics.feedbacks.find(
      (item) => item.interviewRequestId.toString() === interviewRequestId
    );

    if (existingFeedback) {
      return res
        .status(400)
        .json({ message: "Feedback for this interview already exists." });
    }

    const averageRating = calculateAverageRating(feedback);

    // Push the feedback into the feedbacks array
    candidate.statistics.feedbacks.push({
      interviewRequestId,
      feedbackData: feedback,
      rating: averageRating,
    });

    // Increment completed interviews count
    candidate.statistics.completedInterviews += 1;

    // Update total feedback count
    const totalFeedbackCount = candidate.statistics.totalFeedbackCount + 1;

    // Update the average rating after including the new feedback
    const updatedAverageRating =
      (candidate.statistics.averageRating *
        candidate.statistics.totalFeedbackCount +
        averageRating) /
      totalFeedbackCount;

    // Update the statistics
    candidate.statistics.totalFeedbackCount = totalFeedbackCount;
    candidate.statistics.averageRating = updatedAverageRating;

    await candidate.save();

    // Get the latest 3 feedbacks (or adjust as needed)
    const latestFeedbacks = candidate.statistics.feedbacks
      .slice(-3)
      .map((item) => {
        const feedbackSections = Object.keys(item.feedbackData);
        const feedbackComments = feedbackSections.map((section) => ({
          section: section,
          comment: item.feedbackData[section].comments || "No comment provided",
          rating: item.feedbackData[section].rating || "No rating provided",
        }));
        return feedbackComments;
      })
      .flat();

    // Send email with feedback information
    const emailContent = candidateFeedbackTemplate(
      candidateName,
      latestFeedbacks,
      url
    );

    await sendEmail(
      candidate.email,
      "Your Interview Feedback",
      "Feedback for your interview is now available.",
      emailContent
    );

    res
      .status(200)
      .json({ message: "Feedback added and email sent successfully." });
  } catch (error) {
    console.error("Error adding feedback:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const calculateAverageRating = (feedback) => {
  const ratings = Object.values(feedback).map((item) => item.rating || 0);
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
};

export const getInterviewerStatistics = async (req, res) => {
  try {
    const interviewerId = req.user.id;
    if (!interviewerId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch the interviewer with populated candidate details
    const interviewer = await Interviewer.findById(interviewerId).populate({
      path: "interviewRequests.candidateId",
      select: "firstName lastName profilePhoto",
    });

    if (!interviewer) {
      return res.status(404).json({ message: "Interviewer not found." });
    }

    const statistics = interviewer.statistics;

    // Calculate the number of pending requests (where status is "Requested")
    const pendingRequestsCount = interviewer.interviewRequests.filter(
      (req) => req.status === "Requested"
    ).length;

    // Update pendingRequests count dynamically
    statistics.pendingRequests = pendingRequestsCount;

    // Map feedbacks with additional details
    const feedbacks = statistics.feedbacks.map((feedback) => {
      const interviewRequest = interviewer.interviewRequests.find(
        (req) => req._id.toString() === feedback.interviewRequestId.toString()
      );

      // Safely handle candidate details
      const candidate = interviewRequest?.candidateId || {};
      const candidateName =
        candidate.firstName && candidate.lastName
          ? `${candidate.firstName} ${candidate.lastName.charAt(0)}...`
          : "N/A";

      return {
        interviewRequestId: feedback.interviewRequestId,
        interviewDate: interviewRequest?.date || "N/A",
        candidateName: candidateName,
        profilePhoto: candidate.profilePhoto || "N/A",
        feedbackData: feedback.feedbackData,
        rating: feedback.rating,
      };
    });

    return res.status(200).json({
      message: "Interviewer statistics retrieved successfully.",
      statistics: {
        completedInterviews: statistics.completedInterviews,
        pendingRequests: statistics.pendingRequests,
        totalAccepted: statistics.totalAccepted,
        averageRating: statistics.averageRating,
        totalFeedbackCount: statistics.totalFeedbackCount,
        feedbacks: feedbacks,
      },
    });
  } catch (error) {
    console.error("Error fetching interviewer statistics:", error.message);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

export const getInterviewerProfileCompletion = async (req, res) => {
  try {
    const interviewerId = req.user.id;
    const interviewer = await Interviewer.findById(interviewerId);
    if (!interviewer) {
      return res.status(404).json({ message: "Interviewer not found" });
    }

    const completion = calculateInterviewerProfileCompletion(interviewer);
    res.status(200).json({
      success: true,
      totalPercentage: completion.totalPercentage,
      isComplete: completion.isComplete,
      missingSections: completion.missingSections,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rescheduleInterviewRequest = async (req, res) => {
  try {
    const { interviewRequestId, newDate, from, to } = req.body;

    // Validation
    const missingFields = [];
    if (!interviewRequestId) missingFields.push("interviewRequestId");
    if (!newDate) missingFields.push("newDate");
    if (!from) missingFields.push("from");
    if (!to) missingFields.push("to");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Extract numeric date part (e.g., "20/03/2025") from "Thursday, 20/03/2025"
    const numericDate = newDate.split(", ").pop();
    if (!numericDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(numericDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use DD/MM/YYYY",
      });
    }

    // Time validation
    const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9] [AP]M$/i;
    const timeErrors = [];
    if (!timeRegex.test(from)) timeErrors.push("from");
    if (!timeRegex.test(to)) timeErrors.push("to");

    if (timeErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid time format in: ${timeErrors.join(
          ", "
        )}. Use HH:MM AM/PM`,
      });
    }

    // Process date and add day name
    const [day, month, year] = numericDate.split("/");
    const isoDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date values",
      });
    }

    const dayName = isoDate.toLocaleDateString("en-US", { weekday: "long" }); // Get day name
    const formattedDate = `${dayName}, ${isoDate.toLocaleDateString("en-US")}`; // Format: "Thursday, 3/14/2025"

    const combinedTime = `${from} - ${to}`;

    // Database updates
    const updateOperations = await Promise.all([
      Interviewer.updateOne(
        { "interviewRequests._id": interviewRequestId },
        {
          $set: {
            "interviewRequests.$.date": formattedDate, // Include day name
            "interviewRequests.$.from": from,
            "interviewRequests.$.to": to,
            "interviewRequests.$.time": combinedTime,
            "interviewRequests.$.status": "Reschedule Requested",
            "interviewRequests.$.isoDate": isoDate,
          },
        }
      ),
      Candidate.updateOne(
        { "scheduledInterviews._id": interviewRequestId },
        {
          $set: {
            "scheduledInterviews.$.date": formattedDate, // Include day name
            "scheduledInterviews.$.from": from,
            "scheduledInterviews.$.to": to,
            "scheduledInterviews.$.time": combinedTime,
            "scheduledInterviews.$.status": "Reschedule Requested",
            "scheduledInterviews.$.isoDate": isoDate,
          },
        }
      ),
    ]);

    // Check update results
    if (updateOperations.some((op) => op.matchedCount === 0)) {
      return res.status(404).json({
        success: false,
        message: "Interview request not found in records",
      });
    }

    // Fetch required data
    const [interviewer, candidate] = await Promise.all([
      Interviewer.findOne(
        { "interviewRequests._id": interviewRequestId },
        { firstName: 1, "interviewRequests.$": 1 }
      ).populate("interviewRequests.candidateId", "email firstName lastName"),
      Candidate.findOne(
        { "scheduledInterviews._id": interviewRequestId },
        { email: 1, firstName: 1, _id: 1 }
      ),
    ]);

    if (!interviewer?.interviewRequests?.[0] || !candidate) {
      return res.status(404).json({
        success: false,
        message: "Associated users not found",
      });
    }

    const interviewRequest = interviewer.interviewRequests[0];

    // Prepare email data
    const emailData = {
      candidateName: candidate.firstName,
      newDate: formattedDate, // Include day name
      timeSlot: combinedTime,
      interviewId: interviewRequestId,
      candidateId: candidate._id,
      url,
      position: interviewRequest.position,
      interviewerName: interviewer.firstName,
    };

    // Generate and send reschedule request email
    const requestEmail = rescheduleRequestTemplate("candidate", {
      ...emailData,
      type: "candidate",
      data: emailData,
    });

    await sendEmail(
      candidate.email,
      "Interview Reschedule Request - Action Required",
      "",
      requestEmail
    );

    return res.status(200).json({
      success: true,
      message: "Reschedule request sent to candidate for approval",
    });
  } catch (error) {
    console.error("Rescheduling error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const approveRescheduleRequest = async (req, res) => {
  try {
    const { interviewRequestId, interviewerId } = req.body;
    const url = process.env.WEBSITE_URL;

    // Validate IDs first
    if (!mongoose.Types.ObjectId.isValid(interviewRequestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview request ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(interviewerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interviewer ID",
      });
    }

    // Update status in both collections
    const updateOperations = await Promise.all([
      Interviewer.updateOne(
        {
          _id: interviewerId,
          "interviewRequests._id": interviewRequestId,
        },
        {
          $set: {
            "interviewRequests.$.status": "Re-Scheduled",
            "interviewRequests.$.rescheduleApproved": true,
          },
        }
      ),
      Candidate.updateOne(
        { "scheduledInterviews._id": interviewRequestId },
        {
          $set: {
            "scheduledInterviews.$.status": "Re-Scheduled",
            "scheduledInterviews.$.rescheduleApproved": true,
          },
        }
      ),
    ]);

    if (updateOperations.some((op) => op.modifiedCount === 0)) {
      return res.status(404).json({
        success: false,
        message: "Request not found or already approved",
      });
    }

    // Fetch updated data
    const [interviewer, candidate] = await Promise.all([
      Interviewer.findOne(
        { "interviewRequests._id": interviewRequestId },
        { email: 1, firstName: 1, "interviewRequests.$": 1 }
      ).populate("interviewRequests.candidateId", "email firstName"),
      Candidate.findOne(
        { "scheduledInterviews._id": interviewRequestId },
        { email: 1, firstName: 1, _id: 1 }
      ),
    ]);

    const interviewRequest = interviewer.interviewRequests[0];

    // Generate meet link if not exists (same logic as candidate version)
    let meetLink = interviewRequest.meetLink;
    if (!meetLink) {
      const googleMeetLinks = [
        "https://meet.google.com/xbn-baxk-deo",
        "https://meet.google.com/ydn-cbxl-fpo",
      ];
      meetLink =
        googleMeetLinks[Math.floor(Math.random() * googleMeetLinks.length)];

      await Promise.all([
        Interviewer.updateOne(
          { "interviewRequests._id": interviewRequestId },
          { $set: { "interviewRequests.$.meetLink": meetLink } }
        ),
        Candidate.updateOne(
          { "scheduledInterviews._id": interviewRequestId },
          { $set: { "scheduledInterviews.$.meetLink": meetLink } }
        ),
      ]);
    }

    // Prepare confirmation emails
    const emailData = {
      newDate: interviewRequest.date,
      newTime: interviewRequest.time,
      meetLink,
      interviewId: interviewRequestId,
      candidateId: candidate._id,
      interviewerId: interviewer._id,
      candidateName: candidate.firstName,
      interviewerName: interviewer.firstName,
      url,
    };

    // Send confirmation emails (use different templates if needed)
    const [candidateEmail, interviewerEmail] = await Promise.all([
      sendEmail(
        candidate.email,
        "Interview Reschedule Confirmed",
        "",
        rescheduleCandidateTemplate(
          emailData.candidateName,
          emailData.newDate,
          emailData.newTime,
          emailData.meetLink,
          emailData.interviewId,
          emailData.interviewerId,
          emailData.url
        )
      ),
      sendEmail(
        interviewer.email,
        "Interview Reschedule Confirmed",
        "",
        rescheduleInterviewerTemplate(
          emailData.interviewerName,
          emailData.candidateName,
          emailData.newDate,
          emailData.newTime,
          emailData.meetLink,
          emailData.interviewId,
          emailData.candidateId,
          emailData.url
        )
      ),
    ]);

    return res.status(200).json({
      success: true,
      message: "Reschedule confirmed and notifications sent",
      meetLink,
    });
  } catch (error) {
    console.error("Approval error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getBankDetailsController = async (req, res) => {
  try {
    const interviewer = await Interviewer.findById(req.user.id).select(
      "bankDetails"
    );

    if (!interviewer) {
      return res
        .status(404)
        .json({ success: false, message: "Interviewer not found" });
    }

    const defaultDetails = {
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
    };

    // Decrypt the bank details before sending to client
    const decryptedDetails = interviewer.bankDetails
      ? {
          bankName: decrypt(interviewer.bankDetails.bankName),
          accountHolderName: decrypt(interviewer.bankDetails.accountHolderName),
          accountNumber: decrypt(interviewer.bankDetails.accountNumber),
          ifscCode: decrypt(interviewer.bankDetails.ifscCode),
          branch: decrypt(interviewer.bankDetails.branch),
        }
      : defaultDetails;

    return res.status(200).json({
      success: true,
      details: decryptedDetails,
      securityMessage:
        "All bank details are encrypted with 256-bit SSL and stored securely. We never share your financial information with third parties.",
    });
  } catch (error) {
    console.error("Bank details decryption error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving bank details",
    });
  }
};

export const updateBankDetailsController = async (req, res) => {
  try {
    const { bankName, accountHolderName, accountNumber, ifscCode, branch } = req.body;

    // Validate input
    if (!bankName || !accountHolderName || !accountNumber || !ifscCode || !branch) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Advanced validation
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid IFSC format. Example: ABCD0123456"
      });
    }

    if (!/^\d{9,18}$/.test(accountNumber)) {
      return res.status(400).json({
        success: false,
        message: "Account number must be 9-18 digits"
      });
    }

    // Encrypt all sensitive data
    const encryptedDetails = {
      bankName: encrypt(bankName),
      accountHolderName: encrypt(accountHolderName),
      accountNumber: encrypt(accountNumber),
      ifscCode: encrypt(ifscCode.toUpperCase()),
      branch: encrypt(branch)
    };

    const updatedInterviewer = await Interviewer.findByIdAndUpdate(
      req.user.id,
      { bankDetails: encryptedDetails },
      { new: true, runValidators: true }
    ).select('bankDetails');

    // Return partially masked data
    return res.status(200).json({
      success: true,
      details: {
        bankName,
        accountHolderName,
        accountNumber: accountNumber.replace(/.(?=.{4})/g, '*'), // Mask all but last 4 digits
        ifscCode,
        branch
      },
      securityMessage: "Data encrypted with AES-256 and stored securely"
    });

  } catch (error) {
    console.error('Bank details update error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update bank details",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};