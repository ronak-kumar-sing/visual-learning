"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import CdnVisual from "@/components/system-design/visuals/CdnVisual";
import type { CdnVisualState } from "@/lib/system-design/lessons/perf-consistency/cdn";

interface CdnLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `A Content Delivery Network (CDN) is a globally distributed network of Edge Points of Presence (PoPs) that caches static assets (images, video streams, JavaScript bundles, stylesheets) and dynamic API responses near end-users. Utilizing Anycast DNS routing, CDNs cut global latency from hundreds of milliseconds to sub-15ms while absorbing multi-terabit volumetric traffic and DDoS attacks.`;

const INTERVIEW_PREP = [
  {
    question: "How does Anycast DNS route users to the closest CDN Edge PoP?",
    answer:
      "Under Anycast, multiple CDN edge servers around the world broadcast the exact same IP address via BGP (Border Gateway Protocol). When a user makes a DNS or HTTP request, internet routers automatically direct the packet along the shortest BGP autonomous system (AS) network path to the nearest geographic PoP.",
  },
  {
    question: "What is the difference between Cache Invalidation (Purging) and Cache Versioning (Fingerprinting)?",
    answer:
      "Purging issues API calls to all global CDN nodes to delete a key, which takes several seconds or minutes to propagate globally. Cache Versioning embeds content hashes into asset filenames (e.g. `main.a8f9c2.js`) with an immutable `max-age=31536000` header, guaranteeing instant updates upon deploy without cache purge delays.",
  },
  {
    question: "What is an Origin Shield and why is it used in large-scale system design?",
    answer:
      "An Origin Shield is an intermediate caching layer placed between hundreds of global Edge PoPs and the central origin data center. It collapses concurrent cache misses from global edge nodes into a single consolidated origin request, preventing origin database and server outages.",
  },
];

export default function CdnLesson({ topic, group, lesson }: CdnLessonProps) {
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
            <p className="font-bold text-amber-400 mb-1 font-mono text-[11px]">
              ⭐ CDN Architectural Superpowers:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
              <li><strong>Anycast BGP Routing:</strong> Directs traffic to closest Edge PoP.</li>
              <li><strong>Origin Offload:</strong> Shields origin servers from 95%+ of static traffic.</li>
              <li><strong>DDoS Protection:</strong> Absorbs massive volumetric attacks at the edge.</li>
              <li><strong>TLS Termination:</strong> Handshake completes in 10ms near user.</li>
            </ul>
          </div>

          <div className="bg-[#18181b] border border-amber-400/30 p-2.5 rounded-xl space-y-1">
            <p className="font-bold text-amber-400 text-[11px]">
              ⏱️ Latency Comparison:
            </p>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              Tokyo ➔ Virginia Origin: <strong>190ms</strong><br/>
              Tokyo ➔ Tokyo Edge PoP: <strong>12ms (16x Speedup!)</strong>
            </p>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/30 p-2 rounded-xl text-[10px] text-amber-300 font-mono">
            💡 <strong>Pro-Tip:</strong> Use content-hashed filenames (`bundle.hash.js`) with `Cache-Control: public, max-age=31536000, immutable` for zero cache purge delays!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <CdnVisual
          visualState={step.visualState as CdnVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
