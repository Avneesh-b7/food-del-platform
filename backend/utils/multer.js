import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

// 1) Multer storage in memory (buffer)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    // allow only images
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// 2) AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 3) Helper to generate a random filename
function generateFileName(originalName = "") {
  const randomName = crypto.randomBytes(16).toString("hex");
  const ext = originalName.includes(".")
    ? originalName.substring(originalName.lastIndexOf("."))
    : "";
  return `${randomName}${ext}`;
}

// 4) Upload buffer to S3 and return public URL
async function uploadToS3(file, folder = "uploads") {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const fileName = generateFileName(file.originalname);

  const key = `${folder}/${fileName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  // Public URL format (for public buckets)
  const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return fileUrl;
}

export { upload, uploadToS3 };
