import type { Lesson } from "@/lib/system-design/types";

export interface DeviceInfo {
  id: string;
  name: string;
  type: "laptop" | "phone" | "server" | "router" | "dest-server";
  ip: string;
  isPrivate: boolean;
  subnetGroup: number; // 1 or 2
}

export interface IpAddressVisualState {
  stepPhase: "classify" | "subnetting" | "inspect" | "nat-flow";
  subnetMask: string; // e.g. "/24 (255.255.255.0)"
  selectedDeviceId: string;
  natActive: boolean;
  translatedIp: string;
  packetPos: "client" | "router" | "internet";
}

export const ipAddressLesson: Lesson = {
  pseudocode: [
    "// IP Classification & NAT Logic",
    "function classifyIP(ip):",
    "  if ip.startsWith('10.') or ip.startsWith('192.168.'):",
    "    return { type: 'PRIVATE', routable: false }",
    "  else:",
    "    return { type: 'PUBLIC', routable: true }",
    "",
    "function handleNAT(packet):",
    "  if packet.src.isPrivate:",
    "    router.natTable.save(packet.src, router.publicIP)",
    "    packet.src = router.publicIP",
    "  forward(packet, destination)",
  ],

  steps: [
    {
      narration:
        "Every device on a network requires an IP address. Private IPs (10.x.x.x, 192.168.x.x) are used inside local networks, while Public IPs are globally unique.",
      activeLine: 1,
      state: {
        selectedDevice: "Laptop 1",
        ipAddress: "192.168.1.10",
        addressClass: "Private (RFC 1918)",
        subnetMask: "/24 (255.255.255.0)",
        natStatus: "Inactive",
      },
      visualState: {
        stepPhase: "classify",
        subnetMask: "/24 (255.255.255.0)",
        selectedDeviceId: "laptop-1",
        natActive: false,
        translatedIp: "—",
        packetPos: "client",
      } satisfies IpAddressVisualState,
    },
    {
      narration:
        "Subnetting (/24 mask) groups devices on the 192.168.1.0/24 network together so they can communicate directly without touching the external internet.",
      activeLine: 2,
      state: {
        selectedDevice: "Phone 1",
        ipAddress: "192.168.1.15",
        addressClass: "Private (RFC 1918)",
        subnetMask: "/24 (255.255.255.0)",
        natStatus: "Inactive",
      },
      visualState: {
        stepPhase: "subnetting",
        subnetMask: "/24 (255.255.255.0)",
        selectedDeviceId: "phone-1",
        natActive: false,
        translatedIp: "—",
        packetPos: "client",
      } satisfies IpAddressVisualState,
    },
    {
      narration:
        "Selecting any local device reveals its internal private IP and subnet properties. Private IPs cannot be routed across the public internet.",
      activeLine: 4,
      state: {
        selectedDevice: "Database Server",
        ipAddress: "10.0.0.5",
        addressClass: "Private (Class A)",
        subnetMask: "/24 (255.255.255.0)",
        natStatus: "Inactive",
      },
      visualState: {
        stepPhase: "inspect",
        subnetMask: "/24 (255.255.255.0)",
        selectedDeviceId: "server-db",
        natActive: false,
        translatedIp: "—",
        packetPos: "client",
      } satisfies IpAddressVisualState,
    },
    {
      narration:
        "When a packet leaves the local network, Network Address Translation (NAT) on the router replaces the private IP (192.168.1.10) with the router's public IP (203.0.113.1).",
      activeLine: 8,
      state: {
        selectedDevice: "Gateway Router",
        ipAddress: "203.0.113.1 (Public)",
        addressClass: "Public Gateway",
        subnetMask: "/24",
        natStatus: "Translating 192.168.1.10 → 203.0.113.1",
      },
      visualState: {
        stepPhase: "nat-flow",
        subnetMask: "/24 (255.255.255.0)",
        selectedDeviceId: "router",
        natActive: true,
        translatedIp: "203.0.113.1",
        packetPos: "router",
      } satisfies IpAddressVisualState,
    },
  ],
};
