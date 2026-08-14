"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import IpAddressVisual from "@/components/system-design/visuals/IpAddressVisual";
import type { IpAddressVisualState } from "@/lib/system-design/lessons/networking/ip-address";

interface IpAddressLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `An IP Address (Internet Protocol Address) is a unique numerical address assigned to each device connected to a network. It acts like a digital house address, allowing devices to identify each other and communicate over the local network or public internet.`;

const INTERVIEW_PREP = [
  {
    question: "Why do cloud architectures (AWS/GCP) use public and private subnets?",
    answer:
      "Security & isolation: Database servers and microservices sit in private subnets with no public IPs to prevent direct internet attacks. Only public load balancers / NAT Gateways handle public internet routing.",
  },
  {
    question: "How does NAT (PAT) solve IPv4 address exhaustion?",
    answer:
      "Port Address Translation (PAT) allows thousands of internal devices with private IPs to share a single public IP by tracking unique ephemeral source ports in a NAT translation table.",
  },
  {
    question: "What is the difference between IPv4 and IPv6?",
    answer:
      "IPv4 uses 32-bit dotted-decimal addresses (~4.3 billion addresses). IPv6 uses 128-bit hexadecimal addresses (~340 undecillion addresses) to solve address exhaustion globally.",
  },
];

export default function IpAddressLesson({
  topic,
  group,
  lesson,
}: IpAddressLessonProps) {
  return (
    <LessonShell
      topic={topic}
      group={group}
      lesson={lesson}
      definition={DEFINITION}
      interviewPrep={INTERVIEW_PREP}
      callout={
        <div className="space-y-3 text-xs text-zinc-300">
          {/* House Address Analogy */}
          <div className="bg-amber-400/10 border border-amber-400/30 p-2.5 rounded-xl">
            <p className="font-bold text-amber-400 mb-0.5">
              🏠 Remember Analogy:
            </p>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              IP Address works like a <strong>House Address</strong> for devices to find each other.
            </p>
          </div>

          {/* Format of IPv4 (32-bit) */}
          <div>
            <p className="font-bold text-amber-400 mb-1">
              📐 Format of IPv4 (32-bit):
            </p>
            <div className="grid grid-cols-4 gap-1 font-mono text-[10px] text-center">
              <div className="bg-black/50 border border-white/10 p-1 rounded">
                Octet 1<br /><span className="text-amber-300">8 bits</span>
              </div>
              <div className="bg-black/50 border border-white/10 p-1 rounded">
                Octet 2<br /><span className="text-amber-300">8 bits</span>
              </div>
              <div className="bg-black/50 border border-white/10 p-1 rounded">
                Octet 3<br /><span className="text-amber-300">8 bits</span>
              </div>
              <div className="bg-black/50 border border-white/10 p-1 rounded">
                Octet 4<br /><span className="text-amber-300">8 bits</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1 font-mono">
              Example: 192.168.1.10 ➔ 11000000.10101000.00000001.00001010
            </p>
          </div>

          {/* Reserved Private IP Ranges */}
          <div>
            <p className="font-bold text-amber-400 mb-1">
              🔒 Reserved Private IP Ranges (RFC 1918):
            </p>
            <div className="space-y-1 font-mono text-[10px]">
              <div className="flex justify-between bg-black/40 p-1 rounded">
                <span className="text-emerald-400">Class A</span>
                <span className="text-zinc-300">10.0.0.0 – 10.255.255.255</span>
              </div>
              <div className="flex justify-between bg-black/40 p-1 rounded">
                <span className="text-emerald-400">Class B</span>
                <span className="text-zinc-300">172.16.0.0 – 172.31.255.255</span>
              </div>
              <div className="flex justify-between bg-black/40 p-1 rounded">
                <span className="text-emerald-400">Class C</span>
                <span className="text-zinc-300">192.168.0.0 – 192.168.255.255</span>
              </div>
            </div>
          </div>

          {/* IPv4 vs IPv6 Comparison Table */}
          <div>
            <p className="font-bold text-amber-400 mb-1">
              ⚖️ IPv4 vs IPv6 Comparison:
            </p>
            <table className="w-full text-[10px] font-mono border-collapse border border-white/10">
              <thead>
                <tr className="bg-zinc-800 text-zinc-300">
                  <th className="p-1 border border-white/10">Feature</th>
                  <th className="p-1 border border-white/10 text-amber-300">IPv4</th>
                  <th className="p-1 border border-white/10 text-teal-300">IPv6</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400 text-center">
                <tr>
                  <td className="p-1 border border-white/10 text-left">Length</td>
                  <td className="p-1 border border-white/10">32-bit</td>
                  <td className="p-1 border border-white/10">128-bit</td>
                </tr>
                <tr>
                  <td className="p-1 border border-white/10 text-left">Format</td>
                  <td className="p-1 border border-white/10">Dotted Decimal</td>
                  <td className="p-1 border border-white/10">Hexadecimal</td>
                </tr>
                <tr>
                  <td className="p-1 border border-white/10 text-left">Addresses</td>
                  <td className="p-1 border border-white/10">~4.3 Billion</td>
                  <td className="p-1 border border-white/10">~340 Undecillion</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Note */}
          <div className="text-[10px] text-zinc-400 italic">
            📌 <strong>Note:</strong> IP addresses can be <strong>Dynamic</strong> (assigned via DHCP and may change) or <strong>Static</strong> (remains fixed).
          </div>
        </div>
      }
      visual={(step: LessonStep) => (
        <IpAddressVisual
          visualState={step.visualState as IpAddressVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
