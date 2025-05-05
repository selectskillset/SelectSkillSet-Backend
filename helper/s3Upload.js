import AWS from "aws-sdk";
import multer from "multer";

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWSS_OPEN_KEY,
  secretAccessKey: process.env.AWSS_SEC_KEY,
  region: process.env.AWSS_REGION,
});

export const uploadToS3 = async (file, folder) => {
    try {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folder}/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        // Remove ACL: 'public-read'
      };
      const result = await s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  };


// Update multer configuration in your routes file
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profilePhoto') {
      if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        return cb(new Error('Only image files are allowed for profile photos'));
      }
    }
    if (file.fieldname === 'resume') {
      if (!file.mimetype.match(/^application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)) {
        return cb(new Error('Only PDF or Word documents are allowed for resumes'));
      }
    }
    cb(null, true);
  }
});