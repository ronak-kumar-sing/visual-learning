"use client";

import type { Topic, Group } from "@/lib/system-design/topics";
import type { Lesson, LessonStep } from "@/lib/system-design/types";
import LessonShell from "@/components/lesson/LessonShell";
import HttpHttpsVisual from "@/components/system-design/visuals/HttpHttpsVisual";
import type { HttpHttpsVisualState } from "@/lib/system-design/lessons/web-apis/http-https";

interface HttpHttpsLessonProps {
  topic: Topic;
  group: Group;
  lesson: Lesson;
}

const DEFINITION = `HTTP (HyperText Transfer Protocol) transmits data in unencrypted plaintext over Port 80, leaving sensitive data vulnerable to eavesdropping, data theft, and message forgery. HTTPS (HTTP Secure) runs HTTP over TLS/SSL encryption on Port 443, utilizing a 4-phase handshake (TCP Handshake, Certificate Validation, Asymmetric Key Exchange, and Symmetric Session Key Data Transmission) to guarantee confidentiality, integrity, and authentication.`;

const INTERVIEW_PREP = [
  {
    question: "Why does HTTPS use both Asymmetric and Symmetric encryption (Hybrid Encryption)?",
    answer:
      "Asymmetric encryption (RSA/ECC with Public/Private key pair) is computationally expensive and slow for large data payloads, so it is used ONLY during the handshake to securely exchange a symmetric Session Key. Symmetric encryption (AES-GCM/ChaCha20) is blazingly fast and is used to encrypt all actual HTTP data payloads.",
  },
  {
    question: "What is the role of a Certificate Authority (CA) in HTTPS?",
    answer:
      "A CA issues and digitally signs SSL/TLS certificates for domain owners. When a browser connects to an HTTPS website, it verifies the certificate against built-in root CAs to confirm server identity and prevent Man-In-The-Middle (MITM) spoofing.",
  },
  {
    question: "What performance impact does TLS 1.3 have compared to TLS 1.2?",
    answer:
      "TLS 1.3 reduces the handshake latency from 2 Round-Trip Times (2 RTT) down to 1 RTT by combining the key exchange and handshake negotiation into a single round trip. It also supports 0-RTT resumption for returning clients.",
  },
];

export default function HttpHttpsLesson({
  topic,
  group,
  lesson,
}: HttpHttpsLessonProps) {
  return (
    <LessonShell
      topic={topic}
      group={group}
      lesson={lesson}
      definition={DEFINITION}
      interviewPrep={INTERVIEW_PREP}
      callout={
        <div className="space-y-2 text-xs text-zinc-300">
          <p>
            <strong>GeeksforGeeks &amp; Infographic Key Takeaways:</strong>
          </p>
          <ul className="list-disc pl-4 space-y-1 text-zinc-400">
            <li>
              🚨 <strong>HTTP (Port 80):</strong> Plaintext transmission. Vulnerable to Message Forgery, Data Theft, and Eavesdropping.
            </li>
            <li>
              🛡️ <strong>HTTPS (Port 443):</strong> Secured via 4-Phase TLS Handshake (TCP Handshake ➔ Certificate Check ➔ Key Exchange ➔ Data Transmission).
            </li>
            <li>
              🔑 <strong>Hybrid Encryption:</strong> Asymmetric encryption for key exchange + Symmetric Session Key for fast payload encryption.
            </li>
          </ul>
        </div>
      }
      visual={(step: LessonStep) => (
        <HttpHttpsVisual
          visualState={step.visualState as HttpHttpsVisualState}
          accentHex={group.accentHex}
        />
      )}
    />
  );
}
