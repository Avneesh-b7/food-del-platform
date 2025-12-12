import multer from "multer";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import mongoose from "mongoose";

// helper functions
function now() {
  return new Date().toISOString();
}

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

// PROMPT
// async function removeFromS3(req, folder = "FoodItemImages") {
// creates a s3 client ;  const s3 = createS3Client();
// takes the object id from request (checks if its valid)
// gets the correspondng image url and parses out the image name
// deletes the image from S3

// returns industry standard API response codes and errors/ response messages
// logs all the necessary information to console
// handles errors gracefully
// has a verbosity level of medium for all respones/logs so that it is easier for the user to troubleshoot the error

// }

function extractKey(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  try {
    const u = new URL(imageUrl);
    let key = decodeURIComponent(u.pathname);
    if (key.startsWith("/")) key = key.slice(1);
    return key || null;
  } catch {
    // Not a URL — treat as raw key
    return imageUrl;
  }
}

async function removeFromS3(imageUrl, folder = "FoodItemImages") {
  console.info(`[${now()}] removeFromS3 - start`, { imageUrl });

  if (!imageUrl) {
    return {
      success: false,
      message: "No imageUrl provided to removeFromS3",
    };
  }

  // Extract key
  let key = extractKey(imageUrl);

  if (!key) {
    console.error(`[${now()}] removeFromS3 - unable to extract key`, {
      imageUrl,
    });
    return {
      success: false,
      message: "Failed to derive S3 key from the provided image URL",
    };
  }

  // If you want to enforce folder prefix (optional):
  if (folder && !key.startsWith(folder + "/") && !key.includes("/")) {
    key = `${folder}/${key}`;
  }

  console.info(`[${now()}] removeFromS3 - derived key`, { key });

  const bucket = process.env.AWS_S3_BUCKET_NAME;

  if (!bucket) {
    console.error(`[${now()}] removeFromS3 - missing bucket env variable`);
    return {
      success: false,
      message: "S3 bucket environment variable not configured",
    };
  }

  const s3 = createS3Client();

  try {
    const cmd = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const result = await s3.send(cmd);

    console.info(`[${now()}] removeFromS3 - S3 delete successful`, {
      bucket,
      key,
      result,
    });

    return {
      success: true,
      message: "Image deleted successfully from S3",
      key,
      bucket,
    };
  } catch (err) {
    console.error(`[${now()}] removeFromS3 - S3 delete failed`, {
      error: err?.message || err,
      key,
      bucket,
    });

    return {
      success: false,
      message: "Failed to delete image from S3",
      error: err?.message,
    };
  }
}

export { upload, uploadToS3, removeFromS3 };

// console.log(process.env.AWS_ACCESS_KEY_ID);
