import { Interviewer } from '../model/interviewerModel.js'
import {
  registerCandidate as registerCandidateService,
  loginCandidate as loginCandidateService,
  getProfile,
  deleteProfile,
  importFromResume as importFromResumeService,
  importFromLinkedIn as importFromLinkedInService,
  getInterviewers as getInterviewersService,
  scheduleInterview as scheduleInterviewService,
  getScheduledInterviewsService,
  calculateProfileCompletion
} from '../services/candidateService.js'
import { interviewerFeedbackTemplate } from '../templates/interviewerFeedbackTemplate.js'
import { sendEmail } from '../helper/emailService.js'
import { Candidate } from '../model/candidateModel.js'
import { uploadToS3 } from '../helper/s3Upload.js'
import { sendOtp, verifyOtp } from '../helper/otpService.js'
import { isSlotExpired } from '../utils/slotUtils.js'
import { rescheduleInterviewerTemplate } from '../templates/interviewerTemplate.js'
import { rescheduleCandidateTemplate } from '../templates/candidateTemplate.js'
import { rescheduleRequestTemplate } from '../templates/rescheduleRequestTemplate.js'
import mongoose from 'mongoose'

export const registerCandidate = async (req, res) => {
  try {
    const { email } = req.body

    const existingCandidate = await Candidate.findOne({ email })
    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please Login'
      })
    }

    await sendOtp(email)

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.'
    })
  } catch (error) {
    console.error('Error during candidate registration:', error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    })
  }
}

export const verifyOtpAndRegister = async (req, res) => {
  try {
    const { otp, email, password, ...rest } = req.body

    verifyOtp(email, otp)

    const { token, candidateDetails } = await registerCandidateService({
      email,
      password,
      ...rest
    })

    return res.status(201).json({
      success: true,
      token,
      candidate: candidateDetails
    })
  } catch (error) {
    console.error('Error during OTP verification:', error.message)
    return res.status(400).json({ success: false, message: error.message })
  }
}

export const loginCandidate = async (req, res) => {
  try {
    await loginCandidateService(req.body, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getCandidateProfile = async (req, res) => {
  try {
    await getProfile(req.user.id, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const updateCandidateProfile = async (req, res) => {
  try {
    const { id } = req.user
    const files = req.files || {}
    const updates = { ...req.body }

    const jsonFields = ['skills', 'experiences']
    jsonFields.forEach(field => {
      if (updates[field]) {
        try {
          updates[field] = JSON.parse(updates[field])
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: `Invalid ${field} format. Expected valid JSON.`
          })
        }
      }
    })

    // Handle file uploads
    if (files.profilePhoto?.[0]) {
      updates.profilePhoto = await uploadToS3(
        files.profilePhoto[0],
        'profile-photos'
      )
    } else if (updates.profilePhoto === '') {
      // Handle profile photo removal
      updates.profilePhoto = null
    } else {
      // Remove profilePhoto from updates if not being changed
      delete updates.profilePhoto
    }

    if (files.resume?.[0]) {
      updates.resume = await uploadToS3(files.resume[0], 'resumes')
    } else if (updates.resume === '') {
      // Handle resume removal
      updates.resume = null
    } else {
      // Remove resume from updates if not being changed
      delete updates.resume
    }

    // Update profile
    const updatedProfile = await Candidate.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -isSuspended -statistics.feedbacks')

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: updatedProfile
    })
  } catch (error) {
    console.error('Profile update error:', error)
    const statusCode = error.name === 'ValidationError' ? 400 : 500
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}
export const getInterviewerProfile = async (req, res) => {
  const id = req.params.id
  try {
    // Fetch interviewer data
    const interviewer = await Interviewer.findById(id).select(
      'firstName lastName email summary  location jobTitle profilePhoto experience totalInterviews price skills bookedSlots availability statistics.averageRating statistics.totalFeedbackCount'
    )

    if (!interviewer) {
      return res.status(404).json({ message: 'Interviewer not found' })
    }

    // Filter out expired slots
    const validSlots = interviewer.availability.dates.filter(
      slot => !isSlotExpired(slot)
    )

    // Filter out booked slots from availability
    const availableSlots = validSlots.filter(slot => {
      return !interviewer.bookedSlots.some(
        bookedSlot =>
          bookedSlot.date === slot.date &&
          bookedSlot.from === slot.from &&
          bookedSlot.to === slot.to
      )
    })

    // Format response data
    const response = {
      firstName: interviewer.firstName,
      lastName: interviewer.lastName,
      email: interviewer.email,
      summary: interviewer.summary,
      location: interviewer.location || 'N/A',
      jobTitle: interviewer.jobTitle || 'N/A',
      profilePhoto:
        interviewer.profilePhoto || 'https://default-profile-image.com',
      experience: interviewer.experience || 'Not specified',
      totalInterviews: interviewer.totalInterviews || '0',
      price: interviewer.price || 'Not specified',
      skills: interviewer.skills || [],
      availability: availableSlots, // Only include available slots
      averageRating: interviewer.statistics?.averageRating || 0,
      totalFeedbackCount: interviewer.statistics?.totalFeedbackCount || 0
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Error fetching interviewer profile:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteCandidateProfile = async (req, res) => {
  try {
    await deleteProfile(req.user.id, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const importFromResume = async (req, res) => {
  try {
    await importFromResumeService(req.user.id, req.body.resumeData, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const importFromLinkedIn = async (req, res) => {
  try {
    await importFromLinkedInService(req.user.id, req.body.linkedInData, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getInterviewers = async (req, res) => {
  try {
    const result = await getInterviewersService()

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message
      })
    }

    res.status(200).json({
      success: true,
      count: result.data.length,
      data: result.data
    })
  } catch (error) {
    console.error('Error in getInterviewers controller:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}

export const scheduleInterview = async (req, res) => {
  const data = req.body

  try {
    await scheduleInterviewService(req.user.id, data, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const getScheduledInterviews = async (req, res) => {
  try {
    const result = await getScheduledInterviewsService(req.user.id)
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const addInterviewerFeedback = async (req, res) => {
  const { interviewerId, interviewRequestId, feedback } = req.body

  if (
    !interviewerId ||
    !interviewRequestId ||
    !feedback ||
    typeof feedback !== 'object'
  ) {
    return res
      .status(400)
      .json({ message: 'Missing or invalid required fields.' })
  }

  try {
    const interviewer = await Interviewer.findById(interviewerId)
    if (!interviewer) {
      return res.status(404).json({ message: 'Interviewer not found.' })
    }

    // Find the interview request in the interviewer's list
    const interviewIndex = interviewer.interviewRequests.findIndex(
      i => i._id.toString() === interviewRequestId
    )

    if (interviewIndex === -1) {
      return res.status(404).json({ message: 'Interview request not found.' })
    }

    // Check if interview is already completed
    if (interviewer.interviewRequests[interviewIndex].status === 'Completed') {
      return res.status(400).json({ message: 'Interview already completed.' })
    }

    // Update interview status to Completed
    interviewer.interviewRequests[interviewIndex].status = 'Completed'
    interviewer.markModified('interviewRequests')

    const existingFeedback = interviewer.statistics.feedbacks.find(
      item => item.interviewRequestId?.toString() === interviewRequestId
    )

    if (existingFeedback) {
      return res
        .status(400)
        .json({ message: 'Feedback for this interview already exists.' })
    }

    const averageRating = calculateAverageRating(feedback)

    interviewer.statistics.feedbacks.push({
      interviewRequestId,
      feedbackData: feedback,
      rating: averageRating
    })

    // Update statistics
    interviewer.statistics.completedInterviews += 1
    interviewer.statistics.totalAccepted += 1
    interviewer.statistics.totalFeedbackCount += 1

    const totalAccepted = interviewer.statistics.totalAccepted
    const currentAverage = interviewer.statistics.averageRating

    interviewer.statistics.averageRating =
      (currentAverage * (totalAccepted - 1) + averageRating) / totalAccepted

    await interviewer.save()

    const latestFeedbacks = interviewer.statistics.feedbacks
      .slice(-3)
      .map(item => {
        const feedbackData = item.feedbackData
        return Object.entries(feedbackData).map(([section, data]) => ({
          section,
          comment: data.comments || 'No comment provided',
          rating: data.rating || 0
        }))
      })

    const feedbackForEmail = latestFeedbacks.flat()

    const url = process.env.WEBSITE_URL

    const emailContent = interviewerFeedbackTemplate(
      interviewer.firstName,
      feedbackForEmail,
      url
    )
    await sendEmail(
      interviewer.email,
      'Feedback Received for Your Interview',
      'Feedback for your interview has been submitted.',
      emailContent
    )

    return res
      .status(200)
      .json({ message: 'Feedback added and email sent successfully.' })
  } catch (error) {
    console.error('Error adding feedback:', error)
    return res
      .status(500)
      .json({ message: 'Server error. Please try again later.' })
  }
}

const calculateAverageRating = feedback => {
  const ratings = Object.values(feedback).map(item => item.rating || 0)
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
}

export const getCandidateStatistics = async (req, res) => {
  try {
    const candidateId = req.user.id

    if (!candidateId) {
      return res.status(400).json({ message: 'User ID is required.' })
    }

    const candidate = await Candidate.findById(candidateId)

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' })
    }

    const { statistics } = candidate

    // Enrich feedbacks with interview details
    const enrichedFeedbacks = await Promise.all(
      statistics.feedbacks.map(async feedback => {
        // Find the scheduled interview details
        const scheduledInterview = candidate.scheduledInterviews.find(
          interview =>
            interview._id.toString() === feedback.interviewRequestId.toString()
        )

        if (scheduledInterview) {
          // Find the interviewer's details
          const interviewer = await Interviewer.findById(
            scheduledInterview.interviewerId
          ).select('firstName lastName profilePhoto')

          return {
            ...feedback._doc, // Spread feedback fields
            interviewDate: scheduledInterview.date,
            interviewer: interviewer
              ? {
                  firstName: interviewer.firstName,
                  lastName: interviewer.lastName,
                  profilePhoto: interviewer.profilePhoto
                }
              : null
          }
        }

        return feedback
      })
    )

    return res.status(200).json({
      message: 'Candidate statistics retrieved successfully.',
      statistics: {
        completedInterviews: statistics.completedInterviews,
        averageRating: statistics.averageRating,
        totalFeedbackCount: statistics.totalFeedbackCount,
        feedbacks: enrichedFeedbacks
      }
    })
  } catch (error) {
    console.error('Error fetching candidate statistics:', error)
    return res
      .status(500)
      .json({ message: 'Server error. Please try again later.' })
  }
}

export const getProfileCompletion = async (req, res) => {
  try {
    const candidateId = req.user.id
    const candidate = await Candidate.findById(candidateId)
    if (!candidate)
      return res.status(404).json({ message: 'Candidate not found' })

    const completion = calculateProfileCompletion(candidate)
    res.status(200).json({
      success: true,
      totalPercentage: completion.totalPercentage,
      isComplete: completion.isComplete,
      missingSections: completion.missingSections
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const approveRescheduleRequest = async (req, res) => {
  try {
    const { interviewRequestId, candidateId } = req.body;
    const baseUrl = process.env.MEETING_URL;

    // Update status to Scheduled
    const updateOperations = await Promise.all([
      Candidate.updateOne(
        {
          _id: candidateId,
          'scheduledInterviews._id': interviewRequestId
        },
        {
          $set: {
            'scheduledInterviews.$.status': 'Re-Scheduled',
            'scheduledInterviews.$.rescheduleApproved': true
          }
        }
      ),
      Interviewer.updateOne(
        { 'interviewRequests._id': interviewRequestId },
        {
          $set: {
            'interviewRequests.$.status': 'Re-Scheduled',
            'interviewRequests.$.rescheduleApproved': true
          }
        }
      )
    ]);

    if (updateOperations.some(op => op.modifiedCount === 0)) {
      return res.status(404).json({
        success: false,
        message: 'Request not found or already approved'
      });
    }

    // Fetch updated data
    const [interviewer, candidate] = await Promise.all([
      Interviewer.findOne(
        { 'interviewRequests._id': interviewRequestId },
        { email: 1, firstName: 1, lastName: 1, 'interviewRequests.$': 1 }
      ).populate('interviewRequests.candidateId', 'email firstName lastName'),
      Candidate.findOne(
        { 'scheduledInterviews._id': interviewRequestId },
        { email: 1, firstName: 1, lastName: 1 }
      )
    ]);

    const interviewRequest = interviewer.interviewRequests[0];

    // Construct the URLs using the base URL from the .env file
    const roomName = `room=${interviewRequestId}`;
    const interviewerName = `name=${interviewer.firstName}+${interviewer.lastName}`;
    const candidateName = `name=${candidate.firstName}+${candidate.lastName}`;

    // Create separate meeting links for interviewer and candidate
    const interviewerMeetLink = `${baseUrl}/join?${roomName}&${interviewerName}`;
    const candidateMeetLink = `${baseUrl}/join?${roomName}&${candidateName}`;

    // Prepare confirmation emails
    const emailData = {
      newDate: interviewRequest.date,
      newTime: interviewRequest.time,
      interviewerMeetLink,
      candidateMeetLink,
      interviewId: interviewRequestId,
      candidateId: candidate._id,
      interviewerId: interviewer._id,
      candidateName: candidate.firstName,
      interviewerName: interviewer.firstName,
      url: process.env.WEBSITE_URL
    };

    // Send confirmation emails
    const [candidateEmail, interviewerEmail] = await Promise.all([
      sendEmail(
        candidate.email,
        'Interview Reschedule Confirmed',
        '',
        rescheduleCandidateTemplate(
          emailData.candidateName,
          emailData.newDate,
          emailData.newTime,
          emailData.candidateMeetLink,
          emailData.interviewId,
          emailData.interviewerId,
          emailData.url
        )
      ),
      sendEmail(
        interviewer.email,
        'Interview Reschedule Confirmed',
        '',
        rescheduleInterviewerTemplate(
          emailData.interviewerName,
          emailData.candidateName,
          emailData.newDate,
          emailData.newTime,
          emailData.interviewerMeetLink,
          emailData.interviewId,
          emailData.candidateId,
          emailData.url
        )
      )
    ]);

    return res.status(200).json({
      success: true,
      message: 'Reschedule confirmed and notifications sent',
      interviewerMeetLink,
      candidateMeetLink
    });
  } catch (error) {
    console.error('Approval error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const rescheduleInterviewRequest = async (req, res) => {
  try {
    const { interviewRequestId, newDate, from, to } = req.body
    const candidateId = req.user.id

    // Add validation for candidateId
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID'
      })
    }

    // Validation
    const missingFields = []
    if (!interviewRequestId) missingFields.push('interviewRequestId')
    if (!newDate) missingFields.push('newDate')
    if (!from) missingFields.push('from')
    if (!to) missingFields.push('to')

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      })
    }

    // Date format validation
    const numericDate = newDate.split(', ').pop()
    if (!numericDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(numericDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use DD/MM/YYYY'
      })
    }

    // Time validation (HH:MM AM/PM)
    const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9] [AP]M$/i
    const timeErrors = []
    if (!timeRegex.test(from)) timeErrors.push('from')
    if (!timeRegex.test(to)) timeErrors.push('to')

    if (timeErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid time format in: ${timeErrors.join(
          ', '
        )}. Use HH:MM AM/PM`
      })
    }

    // Date processing
    const [day, month, year] = numericDate.split('/')
    const isoDate = new Date(`${year}-${month}-${day}T00:00:00Z`)
    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date values'
      })
    }

    const dayName = isoDate.toLocaleDateString('en-US', { weekday: 'long' }) // Get day name
    const formattedDate = `${dayName}, ${isoDate.toLocaleDateString('en-US')}` // Format: "Thursday, 3/14/2025"

    const combinedTime = `${from} - ${to}`

    // Database updates
    const updateOperations = await Promise.all([
      Candidate.updateOne(
        {
          _id: candidateId,
          'scheduledInterviews._id': interviewRequestId
        },
        {
          $set: {
            'scheduledInterviews.$.date': formattedDate,
            'scheduledInterviews.$.from': from,
            'scheduledInterviews.$.to': to,
            'scheduledInterviews.$.time': combinedTime,
            'scheduledInterviews.$.status': 'Reschedule Requested',
            'scheduledInterviews.$.isoDate': isoDate
          }
        }
      ),
      Interviewer.updateOne(
        { 'interviewRequests._id': interviewRequestId },
        {
          $set: {
            'interviewRequests.$.date': formattedDate,
            'interviewRequests.$.from': from,
            'interviewRequests.$.to': to,
            'interviewRequests.$.time': combinedTime,
            'interviewRequests.$.status': 'Reschedule Requested',
            'interviewRequests.$.isoDate': isoDate
          }
        }
      )
    ])

    // Check update results
    if (updateOperations.some(op => op.matchedCount === 0)) {
      return res.status(404).json({
        success: false,
        message: 'Interview request not found in records'
      })
    }

    // Fetch related data for email
    const [candidate, interviewer] = await Promise.all([
      Candidate.findById(candidateId).select('email firstName lastName'),
      Interviewer.findOne(
        { 'interviewRequests._id': interviewRequestId },
        { _id: 1, firstName: 1, email: 1, 'interviewRequests.$': 1 }
      )
    ])

    if (!interviewer?.interviewRequests?.[0] || !candidate) {
      return res.status(404).json({
        success: false,
        message: 'Associated users not found'
      })
    }

    const interviewRequest = interviewer.interviewRequests[0]

    // Prepare email data
    const emailData = {
      interviewerId: interviewer._id.toString(), // Add this line
      interviewerName: interviewer.firstName,
      candidateName: candidate.firstName,
      newDate: formattedDate,
      timeSlot: combinedTime,
      position: interviewRequest.position,
      interviewId: interviewRequestId,
      url: process.env.WEBSITE_URL,
      candidateId: candidate._id.toString() // Add this for consistency
    }

    // Send email to interviewer
    const requestEmail = rescheduleRequestTemplate('interviewer', {
      ...emailData,
      type: 'interviewer',
      data: emailData
    })

    await sendEmail(
      interviewer.email,
      'Interview Reschedule Request - Action Required',
      '',
      requestEmail
    )

    return res.status(200).json({
      success: true,
      message: 'Reschedule request sent to interviewer for approval'
    })
  } catch (error) {
    console.error('Rescheduling error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}
