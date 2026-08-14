"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  PRESIGNED_UPLOAD_STEPS,
  type BlobStorageVisualState,
} from "@/lib/system-design/lessons/perf-consistency/blob-storage";

interface BlobStorageVisualProps {
  visualState: BlobStorageVisualState;
  accentHex: string;
}

export default function BlobStorageVisual({
  visualState,
  accentHex,
}: BlobStorageVisualProps) {
  const reduced = useReducedMotion() ?? false;
  const [tabMode, setTabMode] = useState<"presigned-flow" | "db-vs-s3" | "multipart">(
    visualState.activeMode || "presigned-flow"
  );
  const [activeStep, setActiveStep] = useState<number>(1);
  const [uploadPct, setUploadPct] = useState<number>(50);

  const handleSimulateDirectUpload = () => {
    setActiveStep(1);
    setUploadPct(0);
    setTimeout(() => {
      setActiveStep(2);
      setTimeout(() => {
        setActiveStep(3);
        setUploadPct(100);
        setTimeout(() => setActiveStep(4), 1000);
      }, 900);
    }, 700);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-between p-5 select-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-4"
      style={{ backgroundColor: "var(--sd-bg)" }}
    >
      {/* Background SVG Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--sd-text) 1px, transparent 1px), linear-gradient(90deg, var(--sd-text) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* ── HEADER BANNER ─────────────────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-pink-400/30 rounded-2xl px-5 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-pink-400 font-mono tracking-wide flex items-center gap-2">
            <span>📦</span> Blob &amp; Object Storage Architecture (S3 / GCS)
          </h2>
          <p className="text-xs text-zinc-400">
            Presigned URLs · Direct-to-S3 Uploads · DB Metadata Separation · Multipart Chunking
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="join bg-[#18181b] border border-white/10 p-0.5 rounded-lg">
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "presigned-flow"
                ? "btn-accent bg-pink-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("presigned-flow")}
          >
            1. Presigned S3 Upload
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "db-vs-s3"
                ? "btn-accent bg-pink-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("db-vs-s3")}
          >
            2. DB BLOB vs S3
          </button>
          <button
            className={`join-item btn btn-xs font-mono ${
              tabMode === "multipart"
                ? "btn-accent bg-pink-400 text-black font-bold"
                : "btn-ghost text-zinc-400"
            }`}
            onClick={() => setTabMode("multipart")}
          >
            3. Multipart &amp; CDN
          </button>
        </div>
      </div>

      {/* ── MODE 1: PRESIGNED S3 UPLOAD FLOW ──────────────────────────────── */}
      {tabMode === "presigned-flow" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-pink-400">Direct-to-S3 Presigned Upload Lifecycle:</span>
            <button
              onClick={handleSimulateDirectUpload}
              className="btn btn-xs btn-accent bg-pink-400 text-black font-bold font-mono"
            >
              Simulate 2.4GB Video Upload ➔
            </button>
          </div>

          {/* 3 Main Nodes: Client, Backend App Server, Amazon S3 */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-[#18181b] border border-white/10 rounded-xl">
            {/* Client */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#161616] flex flex-col items-center gap-1.5 min-w-[130px] text-center shadow">
              <svg width="36" height="30" viewBox="0 0 44 30" fill="none">
                <rect x="2" y="2" width="40" height="26" rx="3" fill="#18181b" stroke="#f472b6" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="1.5" fill="#ef4444" />
                <circle cx="10" cy="6" r="1.5" fill="#f59e0b" />
                <circle cx="14" cy="6" r="1.5" fill="#10b981" />
                <rect x="6" y="11" width="32" height="13" rx="1" fill="#09090b" />
              </svg>
              <p className="text-[11px] font-bold text-zinc-100">Client Device</p>
              <span className="badge badge-xs badge-secondary">2.4GB File</span>
            </div>

            {/* Middle: Backend API Server (Signs URL) */}
            <div className="p-3.5 rounded-xl border border-blue-400/40 bg-[#161616] flex flex-col items-center text-center gap-1 min-w-[140px] shadow">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="8" rx="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" />
              </svg>
              <p className="text-[11px] font-bold text-blue-400">Backend API</p>
              <span className="badge badge-xs badge-info">Generates HMAC URL</span>
              <p className="text-[9px] text-zinc-400 mt-0.5">0 MB payload handled</p>
            </div>

            {/* Right: S3 Object Storage Bucket */}
            <motion.div
              animate={{
                scale: activeStep === 3 ? 1.05 : 1,
                borderColor: activeStep === 3 ? "#34d399" : "rgba(255,255,255,0.1)",
              }}
              className="p-4 rounded-2xl border bg-[#161616] flex flex-col items-center text-center gap-2 shadow-xl shadow-pink-400/10 min-w-[170px]"
            >
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#34d399" strokeWidth="2">
                <rect x="6" y="8" width="28" height="24" rx="4" />
                <path d="M6 16h28M6 24h28" />
              </svg>
              <div>
                <p className="text-xs font-bold text-emerald-400">Amazon S3 Bucket</p>
                <span className="badge badge-xs badge-success text-black font-bold mt-0.5">
                  Exabyte Object Store
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">Direct PUT Stream (2.4GB)</p>
            </motion.div>
          </div>

          {/* Step Progression Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {PRESIGNED_UPLOAD_STEPS.map((s) => (
              <div
                key={s.stepNumber}
                className={`p-2.5 rounded-xl border text-[11px] space-y-1 transition-all ${
                  activeStep === s.stepNumber
                    ? "bg-pink-500/15 border-pink-400 text-pink-300 ring-1 ring-pink-400/30 shadow-lg"
                    : "bg-[#18181b] border-white/10 text-zinc-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Step {s.stepNumber}</span>
                  <span className="text-[9px] opacity-75">{s.actor}</span>
                </div>
                <p className="font-bold text-zinc-200 text-[10px]">{s.action}</p>
                <p className="text-[9px] opacity-80">{s.bandwidthSaved}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODE 2: DB BLOB VS S3 COMPARISON ──────────────────────────────── */}
      {tabMode === "db-vs-s3" && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Anti-Pattern Card */}
          <div className="bg-[#121214] border border-red-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="badge badge-error text-white font-bold">Database BLOB Anti-Pattern</span>
              <span className="text-red-400 text-[10px]">BYTEA in PostgreSQL</span>
            </div>
            <div className="p-3 rounded-xl bg-[#18181b] border border-red-500/20 space-y-2 text-[11px]">
              <p className="text-zinc-300">🚨 <strong>Buffer Pool Eviction:</strong> Storing 10MB images exhausts server RAM and evicts critical B-Tree indexes.</p>
              <p className="text-zinc-300">🚨 <strong>Heavy Backups:</strong> Database dump sizes balloon to Terabytes, stalling pg_dump.</p>
              <p className="text-zinc-300">🚨 <strong>High Storage Cost:</strong> SSD block storage ($0.10/GB) is 5x more expensive than S3 ($0.02/GB).</p>
            </div>
          </div>

          {/* S3 Object Storage Card */}
          <div className="bg-[#121214] border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="badge badge-success text-black font-bold">Metadata in DB + File in S3</span>
              <span className="text-emerald-400 text-[10px]">Modern System Design Standard</span>
            </div>
            <div className="p-3 rounded-xl bg-[#18181b] border border-emerald-500/20 space-y-2 text-[11px]">
              <p className="text-zinc-300">✓ <strong>Lean Database:</strong> Postgres stores a 120-byte row (`s3_key`, `size`, `uploaded_at`).</p>
              <p className="text-zinc-300">✓ <strong>Infinite Scale:</strong> S3 scales automatically to billions of files without capacity planning.</p>
              <p className="text-zinc-300">✓ <strong>CDN Integration:</strong> CloudFront / Cloudflare caches files directly in front of S3.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: MULTIPART & CDN PLAYBACK ──────────────────────────────── */}
      {tabMode === "multipart" && (
        <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-pink-400">Multipart Chunking &amp; CDN Edge Streaming:</span>
            <span className="badge badge-xs badge-info">High-Throughput Parallel Uploads</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#18181b] border border-blue-400/30 space-y-1.5">
              <span className="badge badge-xs badge-info">1. Parallel Chunking</span>
              <p className="text-zinc-200 font-bold text-xs">Multipart Upload</p>
              <p className="text-[10px] text-zinc-400">Splits large 10GB video into 50MB parallel chunks. If one chunk fails, only that chunk is retried.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-emerald-400/30 space-y-1.5">
              <span className="badge badge-xs badge-success text-black font-bold">2. S3 Re-assembly</span>
              <p className="text-zinc-200 font-bold text-xs">CompleteMultipart</p>
              <p className="text-[10px] text-zinc-400">S3 atomically stitches chunks into the single final object on disk.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#18181b] border border-pink-400/30 space-y-1.5">
              <span className="badge badge-xs badge-secondary font-bold">3. CDN Edge Playback</span>
              <p className="text-pink-400 font-bold text-xs">CloudFront CDN</p>
              <p className="text-[10px] text-zinc-400">Video streamed from closest Edge PoP with byte-range resume support.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM QUICK DIFFERENCE BAR ────────────────────────────────────── */}
      <div className="z-10 w-full max-w-5xl bg-[#121214] border border-white/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#18181b] border border-pink-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div>
            <p className="font-bold text-pink-400">Presigned URL Bandwidth Savings:</p>
            <p className="text-zinc-300 text-[10px]">App servers handle 0 bytes of media payload, avoiding server CPU/RAM bottlenecks.</p>
          </div>
        </div>

        <div className="bg-[#18181b] border border-blue-400/30 p-2.5 rounded-lg flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
          <div>
            <p className="font-bold text-blue-400">Clean Database Separation:</p>
            <p className="text-zinc-300 text-[10px]">Databases store queryable metadata; Object stores hold raw bytes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
