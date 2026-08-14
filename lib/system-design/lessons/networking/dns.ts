import type { Lesson } from "@/lib/system-design/types";

export interface DnsRecordItem {
  type: "A" | "AAAA" | "CNAME" | "MX" | "NS" | "TXT";
  name: string;
  description: string;
  example: string;
}

export const COMMON_DNS_RECORDS: DnsRecordItem[] = [
  {
    type: "A",
    name: "Address Record",
    description: "Maps a domain name to an IPv4 address.",
    example: "google.com → 142.250.190.78",
  },
  {
    type: "AAAA",
    name: "IPv6 Address Record",
    description: "Maps a domain name to a 128-bit IPv6 address.",
    example: "google.com → 2607:f8b0:4004:837::200e",
  },
  {
    type: "CNAME",
    name: "Canonical Name",
    description: "Maps an alias domain to a true (canonical) domain name.",
    example: "www.google.com → google.com",
  },
  {
    type: "MX",
    name: "Mail Exchange",
    description: "Directs email traffic to the domain's incoming mail server.",
    example: "google.com → smtp.google.com (Priority 10)",
  },
  {
    type: "NS",
    name: "Name Server",
    description: "Delegates a DNS zone to use specific Authoritative Name Servers.",
    example: "example.com → ns1.dns-parking.com",
  },
  {
    type: "TXT",
    name: "Text Information",
    description: "Holds machine-readable text for SPF email security and domain ownership verification.",
    example: "v=spf1 include:_spf.google.com ~all",
  },
];

export interface InfographicDnsVisualState {
  currentStepIndex: number; // 0 to 6 (7 steps matching infographic)
  domain: string; // "www.google.com"
  ipAddress: string; // "142.250.190.78"
  activeNode: "browser" | "isp" | "root" | "tld" | "auth" | "loaded";
  activeRecordType: "A" | "AAAA" | "CNAME" | "MX" | "NS" | "TXT";
  isCacheActive: boolean;
  dnsTypeMode: "recursive" | "iterative" | "authoritative";
}

export const dnsLesson: Lesson = {
  pseudocode: [
    "// DNS Resolution Algorithm (Infographic Flow)",
    "function resolveDomain(domainName):",
    "  // Step 1: User enters www.google.com",
    "  if localCache.has(domainName): return localCache.get(domainName)",
    "  ",
    "  // Step 2: ISP Resolver receives request",
    "  // Step 3: Ask Root DNS Server for TLD direction",
    "  tldServer = rootServer.getTLD('.com')",
    "  ",
    "  // Step 4: Ask TLD DNS Server (.com)",
    "  authServer = tldServer.getAuth('google.com')",
    "  ",
    "  // Step 5: Ask Authoritative DNS Server",
    "  ipAddress = authServer.lookupRecord('A', 'www.google.com')",
    "  ",
    "  // Step 6 & 7: Return IP & load website",
    "  resolverCache.set(domainName, ipAddress, ttl=300)",
    "  return ipAddress // 142.250.190.78",
  ],

  steps: [
    {
      narration:
        "Step 1: You enter www.google.com in your browser. The browser checks its local cache first.",
      activeLine: 3,
      state: {
        stepNumber: "1 of 7",
        domain: "www.google.com",
        activeAction: "Entering URL in browser",
        currentIP: "Searching...",
        cacheStatus: "Checking Local Cache",
      },
      visualState: {
        currentStepIndex: 0,
        domain: "www.google.com",
        ipAddress: "142.250.190.78",
        activeNode: "browser",
        activeRecordType: "A",
        isCacheActive: false,
        dnsTypeMode: "recursive",
      } satisfies InfographicDnsVisualState,
    },
    {
      narration:
        "Step 2: On a cache miss, the request goes to your ISP's DNS Resolver (the librarian that finds the answer for you).",
      activeLine: 5,
      state: {
        stepNumber: "2 of 7",
        domain: "www.google.com",
        activeAction: "Forwarding to ISP DNS Resolver",
        currentIP: "Searching...",
        cacheStatus: "Miss",
      },
      visualState: {
        currentStepIndex: 1,
        domain: "www.google.com",
        ipAddress: "142.250.190.78",
        activeNode: "isp",
        activeRecordType: "A",
        isCacheActive: false,
        dnsTypeMode: "recursive",
      } satisfies InfographicDnsVisualState,
    },
    {
      narration:
        "Step 3: The ISP resolver asks the Root DNS Server ('.') for direction. Root directs it to the .com TLD Server.",
      activeLine: 7,
      state: {
        stepNumber: "3 of 7",
        domain: "www.google.com",
        activeAction: "Querying Root DNS Server (.)",
        currentIP: "Searching...",
        cacheStatus: "Root Redirect → .com",
      },
      visualState: {
        currentStepIndex: 2,
        domain: "www.google.com",
        ipAddress: "142.250.190.78",
        activeNode: "root",
        activeRecordType: "A",
        isCacheActive: false,
        dnsTypeMode: "recursive",
      } satisfies InfographicDnsVisualState,
    },
    {
      narration:
        "Step 4: Then it asks the TLD DNS Server (.com, .org, .in etc.), which directs it to google.com's Authoritative Server.",
      activeLine: 10,
      state: {
        stepNumber: "4 of 7",
        domain: "www.google.com",
        activeAction: "Querying TLD DNS Server (.com)",
        currentIP: "Searching...",
        cacheStatus: "TLD Redirect → Authoritative",
      },
      visualState: {
        currentStepIndex: 3,
        domain: "www.google.com",
        ipAddress: "142.250.190.78",
        activeNode: "tld",
        activeRecordType: "A",
        isCacheActive: false,
        dnsTypeMode: "recursive",
      } satisfies InfographicDnsVisualState,
    },
    {
      narration:
        "Step 5: Then it asks the Authoritative DNS Server of google.com, which holds the actual 'A' record.",
      activeLine: 13,
      state: {
        stepNumber: "5 of 7",
        domain: "www.google.com",
        activeAction: "Querying Authoritative DNS Server",
        currentIP: "142.250.190.78",
        cacheStatus: "Record Found ('A')",
      },
      visualState: {
        currentStepIndex: 4,
        domain: "www.google.com",
        ipAddress: "142.250.190.78",
        activeNode: "auth",
        activeRecordType: "A",
        isCacheActive: false,
        dnsTypeMode: "authoritative",
      } satisfies InfographicDnsVisualState,
    },
    {
      narration:
        "Step 6: The Authoritative Server returns IP 142.250.190.78. The ISP resolver caches it (TTL) and sends it back to your browser.",
      activeLine: 16,
      state: {
        stepNumber: "6 of 7",
        domain: "www.google.com",
        activeAction: "Returning IP 142.250.190.78 to Browser",
        currentIP: "142.250.190.78",
        cacheStatus: "Saved to Cache (TTL)",
      },
      visualState: {
        currentStepIndex: 5,
        domain: "www.google.com",
        ipAddress: "142.250.190.78",
        activeNode: "isp",
        activeRecordType: "A",
        isCacheActive: true,
        dnsTypeMode: "recursive",
      } satisfies InfographicDnsVisualState,
    },
    {
      narration:
        "Step 7: Your browser uses the IP address 142.250.190.78 to connect directly to Google's server and load the website! ✓",
      activeLine: 17,
      state: {
        stepNumber: "7 of 7",
        domain: "www.google.com",
        activeAction: "Website Loaded via IP 142.250.190.78",
        currentIP: "142.250.190.78",
        cacheStatus: "Complete ✓",
      },
      visualState: {
        currentStepIndex: 6,
        domain: "www.google.com",
        ipAddress: "142.250.190.78",
        activeNode: "loaded",
        activeRecordType: "A",
        isCacheActive: true,
        dnsTypeMode: "recursive",
      } satisfies InfographicDnsVisualState,
    },
  ],
};
