import type { Lesson } from "@/lib/system-design/types";

export type HttpsPhase =
  | "tcp-handshake"
  | "certificate-check"
  | "key-exchange"
  | "data-transmission";

export interface HttpHttpsVisualState {
  protocol: "http" | "https";
  phase: HttpsPhase;
  threatsActive: boolean; // Message Forgery, Data Theft, Eavesdropping
  asymmetricKeyStatus: "none" | "public-sent" | "session-encrypted";
  symmetricKeyEstablished: boolean;
  activeStep: number;
}

export const httpHttpsLesson: Lesson = {
  pseudocode: [
    "// HTTPS Handshake & Symmetric Encryption Pipeline",
    "function establishHttpsConnection(client, server):",
    "  // Phase 1: TCP 3-Way Handshake",
    "  connectTCP(client, server)",
    "  ",
    "  // Phase 2: Certificate Check (Asymmetric Encryption)",
    "  clientHello = client.send('Client Hello')",
    "  cert = server.send('Server Hello', server.getCertificate())",
    "  client.verifyCertificate(cert.publicKey)",
    "  ",
    "  // Phase 3: Key Exchange (Session Key Generation)",
    "  sessionKey = client.generateSymmetricKey()",
    "  encryptedKey = asymmetricEncrypt(sessionKey, cert.publicKey)",
    "  client.send(encryptedKey)",
    "  server.sessionKey = asymmetricDecrypt(encryptedKey, server.privateKey)",
    "  ",
    "  // Phase 4: Symmetric Data Transmission",
    "  cipherText = symmetricEncrypt(payload, sessionKey)",
    "  return client.transmitSecured(cipherText)",
  ],

  steps: [
    {
      narration:
        "Phase 1: TCP 3-Way Handshake. Client and server exchange TCP SYN, SYN+ACK, and ACK packets to establish a raw TCP connection.",
      activeLine: 3,
      state: {
        protocol: "HTTPS (Port 443)",
        currentPhase: "1. TCP Handshake",
        securityStatus: "Establishing Base Connection",
        encryptionMode: "None (Raw TCP)",
        threatMitigation: "Handshake in Progress",
      },
      visualState: {
        protocol: "https",
        phase: "tcp-handshake",
        threatsActive: false,
        asymmetricKeyStatus: "none",
        symmetricKeyEstablished: false,
        activeStep: 0,
      } satisfies HttpHttpsVisualState,
    },
    {
      narration:
        "Phase 2: Certificate Check (Asymmetric Encryption). Server sends its SSL/TLS Certificate containing its Public Key to the Client.",
      activeLine: 7,
      state: {
        protocol: "HTTPS (Port 443)",
        currentPhase: "2. Certificate Check",
        securityStatus: "Server Identity Verified via Certificate Authority",
        encryptionMode: "Asymmetric Encryption (RSA/ECC)",
        threatMitigation: "Prevents Message Forgery & Identity Spoofing",
      },
      visualState: {
        protocol: "https",
        phase: "certificate-check",
        threatsActive: false,
        asymmetricKeyStatus: "public-sent",
        symmetricKeyEstablished: false,
        activeStep: 1,
      } satisfies HttpHttpsVisualState,
    },
    {
      narration:
        "Phase 3: Key Exchange. Client generates a symmetric Session Key, encrypts it using the Server's Public Key, and sends it back. Server decrypts it with its Private Key.",
      activeLine: 12,
      state: {
        protocol: "HTTPS (Port 443)",
        currentPhase: "3. Key Exchange",
        securityStatus: "Shared Session Key Securely Exchanged",
        encryptionMode: "Hybrid Encryption (Asymmetric Key Exchange)",
        threatMitigation: "Prevents Eavesdropping & Interception",
      },
      visualState: {
        protocol: "https",
        phase: "key-exchange",
        threatsActive: false,
        asymmetricKeyStatus: "session-encrypted",
        symmetricKeyEstablished: true,
        activeStep: 2,
      } satisfies HttpHttpsVisualState,
    },
    {
      narration:
        "Phase 4: Data Transmission (Symmetric Encryption). All HTTP payloads (passwords, user IDs, sensitive data) are encrypted with the fast Session Key.",
      activeLine: 16,
      state: {
        protocol: "HTTPS (Port 443)",
        currentPhase: "4. Data Transmission",
        securityStatus: "Secured & Encrypted End-to-End",
        encryptionMode: "Symmetric Encryption (AES-GCM / ChaCha20)",
        threatMitigation: "Message Forgery, Data Theft & Eavesdropping Blocked ✓",
      },
      visualState: {
        protocol: "https",
        phase: "data-transmission",
        threatsActive: false,
        asymmetricKeyStatus: "session-encrypted",
        symmetricKeyEstablished: true,
        activeStep: 3,
      } satisfies HttpHttpsVisualState,
    },
  ],
};
