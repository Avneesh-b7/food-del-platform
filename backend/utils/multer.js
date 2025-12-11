import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

// PROMPT
// async function uploadToS3() {
//   // # what does this function  do -->
//   //1. takes file from request object , if file does not exists returns an error message
//   //2. checks for the image file size to 5mb max per image
//   //3. creates a unique name for the image file and uploads to S3
//   //4. once uploaded returns a sucessfull public URL of the image stored
//   //5. all of this code should be secure and should use industry standards
//   //6. ensure appripriate error handling and ensure proper response codes (as per industry standards)
//   // we use multer - https://www.npmjs.com/package/multer ; and we also use S3client for AWS
// }
// export { uploadToS3 };

// Multer memory storage (store file in memory as buffer)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    // accept only images
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

// S3 client
function createS3Client() {
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

// helper to build a secure random filename using original extension
function generateFileName(originalName = "") {
  const random = crypto.randomBytes(16).toString("hex");
  const ext =
    originalName && originalName.includes(".")
      ? originalName.substring(originalName.lastIndexOf("."))
      : "";
  return `${random}${ext}`;
}

/**
 * Uploads file from `req.file` to S3 and returns the public URL.
 * Throws an Error with `.statusCode` property for caller-friendly status handling.
 *
 * Usage: await uploadToS3(req, "foods")    // where req.file exists (multer.single('image') used)
 */
async function uploadToS3(req, folder = "FoodItemImages") {
  try {
    // 1) ensure multer put file into req.file
    const file = req?.file;
    if (!file) {
      const e = new Error(
        "No file provided. Use multipart/form-data with field name 'image'."
      );
      e.statusCode = 400;
      throw e;
    }

    // 2) size check (multer already enforces this limit, but double-check)
    const MAX_BYTES = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_BYTES) {
      const e = new Error("File size exceeds 5MB limit.");
      e.statusCode = 413; // Payload Too Large
      throw e;
    }

    const s3 = createS3Client();

    // 3) Create secure unique key
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      const e = new Error("S3 bucket not configured.");
      e.statusCode = 500;
      throw e;
    }

    const fileName = generateFileName(file.originalname);
    const key = `${folder}/${fileName}`;

    // 4) Upload command
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: "public-read", // note: consider private + signed URLs for stricter security
    };

    const cmd = new PutObjectCommand(params);
    await s3.send(cmd);

    // 5) Construct public URL. This works for standard S3 buckets.
    // If you use CloudFront or custom domain, return the CloudFront URL instead.
    const region = process.env.AWS_REGION;
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return fileUrl;
  } catch (err) {
    // Normalize thrown error (attach statusCode if not present)
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // rethrow for controller to handle
    throw err;
  }
}

export { upload, uploadToS3 };

// console.log(process.env.AWS_ACCESS_KEY_ID);
