import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['Candidate', 'Interviewer', 'Corporate', 'Admin'],
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 600000 
  },
  attempts: {
    type: Number,
    default: 0
  }
});

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;