import type { Lesson } from "@/lib/system-design/types";

export interface BlobUploadStepItem {
  stepNumber: number;
  actor: string;
  action: string;
  payload: string;
  bandwidthSaved: string;
}

export const PRESIGNED_UPLOAD_STEPS: BlobUploadStepItem[] = [
  {
    stepNumber: 1,
    actor: "Client ➔ App Server",
    action: "Request Presigned Upload URL",
    payload: "{ filename: 'video_4k.mp4', size: '2.4GB' }",
    bandwidthSaved: "App server handles tiny 100-byte JSON",
  },
  {
    stepNumber: 2,
    actor: "App Server ➔ Client",
    action: "Generate Signed HMAC Token & S3 PUT URL",
    payload: "https://s3.amazonaws.com/bucket/video_4k.mp4?signature=xyz&expires=900",
    bandwidthSaved: "Token signed with AWS secret key in 1ms",
  },
  {
    stepNumber: 3,
    actor: "Client ➔ Amazon S3",
    action: "Direct-to-S3 Multipart Upload (PUT)",
    payload: "Streams 2.4GB directly to S3 Storage Bucket",
    bandwidthSaved: "0 MB of backend server bandwidth consumed!",
  },
  {
    stepNumber: 4,
    actor: "S3 Event ➔ App DB",
    action: "Save Metadata & Trigger CDN Cache",
    payload: "INSERT INTO media_files (s3_url, status) VALUES ('s3://...', 'READY')",
    bandwidthSaved: "Database stores only 120-byte metadata row",
  },
];

export interface BlobStorageVisualState {
  currentStepIndex: number;
  activeMode: "presigned-flow" | "db-vs-s3" | "multipart";
  uploadProgressPct: number;
}

export const blobStorageLesson: Lesson = {
  pseudocode: [
    "// Direct-to-S3 Presigned URL Upload Flow",
    "function handleMediaUpload(client, fileMetadata):",
    "  // Step 1: Validate auth and create signed S3 upload URL",
    "  s3Key = generateUniqueKey(fileMetadata.name)",
    "  presignedUrl = s3Client.getSignedUrl('putObject', {",
    "    Bucket: 'user-media-production',",
    "    Key: s3Key,",
    "    Expires: 900 // 15 minute validity",
    "  })",
    "  ",
    "  // Step 2: Return signed URL to client — Client streams directly to S3!",
    "  // Backend application server burns ZERO bandwidth for heavy GB files",
    "  return { uploadUrl: presignedUrl, mediaKey: s3Key }",
  ],

  steps: [
    {
      narration:
        "Step 1: The Database BLOB Anti-Pattern. Storing large video and image files directly inside PostgreSQL (BYTEA) causes massive table bloat, slow backups, and exhausted RAM buffer caches.",
      activeLine: 2,
      state: {
        architecture: "Database BLOB Anti-Pattern",
        dbTableSize: "500 GB (Heavily Bloated)",
        bufferPoolHitRatio: "23% (RAM exhausted by raw blobs)",
        backupDuration: "8 Hours",
      },
      visualState: {
        currentStepIndex: 0,
        activeMode: "db-vs-s3",
        uploadProgressPct: 0,
      } satisfies BlobStorageVisualState,
    },
    {
      narration:
        "Step 2: Object Storage Separation (S3 + Postgres Metadata). Files live in Amazon S3 / GCS; PostgreSQL stores only a clean 120-byte metadata row with the S3 URL pointer.",
      activeLine: 5,
      state: {
        architecture: "Object Storage + Relational Metadata",
        dbTableSize: "12 Megabytes (Lightweight & Fast)",
        s3StorageCapacity: "Virtually Infinite (Exabytes)",
        bufferPoolHitRatio: "99.2% in RAM ✓",
      },
      visualState: {
        currentStepIndex: 1,
        activeMode: "db-vs-s3",
        uploadProgressPct: 50,
      } satisfies BlobStorageVisualState,
    },
    {
      narration:
        "Step 3: Direct-to-S3 Presigned URL Upload. Client requests a signed URL and uploads the 2.4GB file directly to S3. Zero backend server RAM or bandwidth is consumed!",
      activeLine: 11,
      state: {
        architecture: "Presigned S3 Direct Upload",
        backendBandwidthSaved: "100% (Zero proxy overhead)",
        uploadMethod: "Direct PUT to S3 Bucket with HMAC Signature",
        status: "Upload Complete ✓",
      },
      visualState: {
        currentStepIndex: 2,
        activeMode: "presigned-flow",
        uploadProgressPct: 100,
      } satisfies BlobStorageVisualState,
    },
  ],
};
