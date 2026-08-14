"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import DnsVisual from "@/components/system-design/visuals/DnsVisual";
import type { InfographicDnsVisualState } from "@/lib/system-design/lessons/networking/dns";

interface DnsLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `DNS (Domain Name System) is the Internet's phonebook. It translates easy-to-remember domain names (like www.google.com) into numerical IP addresses (like 142.250.190.78) which computers use to find and communicate with each other on the internet.`;

const INTERVIEW_PREP = [
  {
    question: "What are the 3 Types of DNS Servers in the lookup chain?",
    answer:
      "1) Recursive DNS (finds the answer for you), 2) Iterative DNS (helps direct the search step-by-step), 3) Authoritative DNS (gives the final answer IP for a domain).",
  },
  {
    question: "What are the 6 primary DNS record types every engineer must know?",
    answer:
      "A (IPv4 mapping), AAAA (IPv6 mapping), CNAME (Domain alias), MX (Mail exchange server), NS (Name server delegation), and TXT (Verification & SPF security).",
  },
  {
    question: "How does DNS caching with TTL improve website availability and speed?",
    answer:
      "Results are stored in local and ISP resolver caches for a set TTL (Time To Live). Subsequent user requests hit cache in ~1ms without needing a full 7-step lookup to Root/TLD servers.",
  },
];

export default function DnsLesson({ topic, group, lesson }: DnsLessonProps) {
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
            <p className="font-bold text-amber-400 mb-1">
              📖 Phonebook Analogy:
            </p>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Translates <code className="text-amber-300">www.google.com</code> ➔ IP <code className="text-emerald-300">142.250.190.78</code>.
            </p>
          </div>

          <div>
            <p className="font-bold text-amber-400 mb-1">
              📋 Common DNS Record Types:
            </p>
            <div className="space-y-1 font-mono text-[10px]">
              <div className="flex justify-between bg-black/40 p-1 rounded">
                <span className="text-amber-300 font-bold">A</span>
                <span className="text-zinc-400">IPv4 Address</span>
              </div>
              <div className="flex justify-between bg-black/40 p-1 rounded">
                <span className="text-teal-300 font-bold">AAAA</span>
                <span className="text-zinc-400">IPv6 Address</span>
              </div>
              <div className="flex justify-between bg-black/40 p-1 rounded">
                <span className="text-blue-300 font-bold">CNAME</span>
                <span className="text-zinc-400">Domain Alias</span>
              </div>
              <div className="flex justify-between bg-black/40 p-1 rounded">
                <span className="text-pink-300 font-bold">MX</span>
                <span className="text-zinc-400">Mail Server</span>
              </div>
              <div className="flex justify-between bg-black/40 p-1 rounded">
                <span className="text-purple-300 font-bold">NS / TXT</span>
                <span className="text-zinc-400">Nameserver / SPF</span>
              </div>
            </div>
          </div>

          <div>
            <p className="font-bold text-amber-400 mb-1">
              ⚡ Types of DNS:
            </p>
            <ul className="list-disc pl-4 space-y-0.5 text-zinc-400 text-[11px]">
              <li><strong>Recursive:</strong> Finds answer for you.</li>
              <li><strong>Iterative:</strong> Directs lookup path.</li>
              <li><strong>Authoritative:</strong> Gives final IP.</li>
            </ul>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/30 p-2 rounded text-[11px] text-amber-300">
            🌟 <strong>Fun Fact:</strong> Without DNS, you would have to remember <code className="font-mono">142.250.190.78</code> instead of <code className="font-mono">google.com</code>!
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <DnsVisual
          visualState={step.visualState as InfographicDnsVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
