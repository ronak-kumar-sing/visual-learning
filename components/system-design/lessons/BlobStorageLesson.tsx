"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import BlobStorageVisual from "@/components/system-design/visuals/BlobStorageVisual";
import type { BlobStorageVisualState } from "@/lib/system-design/lessons/perf-consistency/blob-storage";

interface BlobStorageLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `Blob (Binary Large Object) Storage — such as Amazon S3, Google Cloud Storage, or Azure Blob Storage — is highly durable, horizontally scalable object storage engineered specifically for storing massive unstructured files (videos, high-resolution images, document PDFs, and backups). In modern system design, relational databases store only lightweight metadata pointers while files are uploaded directly to Object Storage via Presigned URLs.`;

const INTERVIEW_PREP = [
  {
    question: "Why is storing image and video binary files directly inside relational databases (BLOB/BYTEA) considered an anti-pattern?",
    answer:
      "1) Buffer Pool Contamination: Loading large binary blobs exhausts RAM and evicts critical database indexes, destroying query performance. 2) Operational Headaches: Database dump backups balloon into Terabytes, and replication stream delays increase exponentially. 3) Cost: High-performance NVMe database block storage costs ~5x more per GB than S3 object storage.",
  },
  {
    question: "How do Presigned S3 URLs work and why are they essential for scale?",
    answer:
      "A client asks the API server for permission to upload. The API validates auth and generates a cryptographic HMAC signature in the form of a temporary URL with an expiration window (e.g. 15 minutes). The client then uploads the multi-gigabyte file directly to S3 via HTTP PUT, completely bypassing the backend server and consuming zero API server CPU/RAM/bandwidth.",
  },
  {
    question: "How does Multipart Upload ensure fault tolerance for large file uploads?",
    answer:
      "Multipart Upload splits a large file (e.g. 10GB) into 5MB-50MB chunks and uploads them concurrently. If an internet blip fails chunk #42, only chunk #42 needs to be retried rather than restarting the entire 10GB upload from the beginning.",
  },
];

export default function BlobStorageLesson({
  topic,
  group,
  lesson,
}: BlobStorageLessonProps) {
  return (
    <LessonShell
      topic={topic}
      group={group}
      lesson={lesson}
      definition={DEFINITION}
      interviewPrep={INTERVIEW_PREP}
      callout={
        <div className="space-y-3 text-xs text-zinc-300">
          <div>
            <p className="font-bold text-pink-400 mb-1 font-mono text-[11px]">
              ⭐ Object Storage Architecture Rules:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Metadata in DB:</strong> Store only URL, size, status in PostgreSQL (120 bytes).</li>
              <li><strong>Presigned URLs:</strong> Clients upload directly to S3 (0 backend bandwidth).</li>
              <li><strong>Multipart Upload:</strong> Split files &gt;100MB into parallel chunks.</li>
              <li><strong>Edge Delivery:</strong> Put CDN (CloudFront) in front of S3 for fast reads.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-pink-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-pink-400 text-[11px]">
              💰 Cost &amp; Performance Efficiency:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Database SSD: <strong>$0.10 / GB</strong><br/>
              Amazon S3: <strong>$0.023 / GB (5x Cheaper!)</strong>
            </p>
          </div>

          <div className="bg-pink-400/10 border border-pink-400/30 p-2 rounded-xl text-[10px] text-pink-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Configure S3 Lifecycle Rules to automatically transition older media to S3 Infrequent Access (IA) or Glacier after 30 days!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <BlobStorageVisual
          visualState={step.visualState as BlobStorageVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
