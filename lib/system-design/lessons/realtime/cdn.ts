import type { Lesson } from "@/lib/system-design/types";

export interface EdgeLocationItem {
  id: string;
  city: string;
  region: string;
  latencyToOriginMs: number;
  latencyToLocalUserMs: number;
  isCached: boolean;
}

export const SAMPLE_EDGE_POPS: EdgeLocationItem[] = [
  { id: "lon", city: "London", region: "Europe", latencyToOriginMs: 140, latencyToLocalUserMs: 8, isCached: true },
  { id: "tyo", city: "Tokyo", region: "Asia", latencyToOriginMs: 190, latencyToLocalUserMs: 12, isCached: true },
  { id: "nyc", city: "New York", region: "US East (Near Origin)", latencyToOriginMs: 25, latencyToLocalUserMs: 5, isCached: true },
  { id: "syd", city: "Sydney", region: "Oceania", latencyToOriginMs: 230, latencyToLocalUserMs: 14, isCached: false },
];

export interface CdnVisualState {
  currentStepIndex: number;
  selectedEdgeId: string;
  isEdgeHit: boolean;
  assetType: "static" | "dynamic";
}

export const cdnLesson: Lesson = {
  pseudocode: [
    "// Content Delivery Network (CDN) Edge Routing Engine",
    "function fetchContentViaCDN(clientIp, assetUrl):",
    "  // 1. Anycast DNS routes client to geographically closest Edge PoP",
    "  edgePoP = anycastRouter.getClosestPoP(clientIp)",
    "  ",
    "  // 2. Check Edge Storage Cache",
    "  cachedAsset = edgePoP.cache.get(assetUrl)",
    "  if cachedAsset and not cachedAsset.isExpired():",
    "    return cachedAsset // Edge Cache HIT (8ms - 15ms latency)",
    "  ",
    "  // 3. Edge Cache MISS ➔ Pull from Central Origin Shield",
    "  freshAsset = originServer.fetch(assetUrl)",
    "  edgePoP.cache.set(assetUrl, freshAsset, TTL=freshAsset.headers.sMaxAge)",
    "  return freshAsset",
  ],

  steps: [
    {
      narration:
        "Step 1: Direct Origin Bottleneck (No CDN). A user in Tokyo requests a 2MB video from an Origin server in Virginia. High cross-Pacific roundtrip latency (190ms).",
      activeLine: 11,
      state: {
        architecture: "Direct Origin (No CDN)",
        clientLocation: "Tokyo, Japan",
        originLocation: "US East (Virginia)",
        roundtripLatency: "190 ms (Slow)",
        originLoad: "100% Server Load",
      },
      visualState: {
        currentStepIndex: 0,
        selectedEdgeId: "tyo",
        isEdgeHit: false,
        assetType: "static",
      } satisfies CdnVisualState,
    },
    {
      narration:
        "Step 2: CDN Edge PoP Cache Hit. Tokyo user queries Anycast DNS. Request is terminated and served directly from the local Tokyo Edge PoP in 12ms!",
      activeLine: 8,
      state: {
        architecture: "CDN Edge Network (Anycast DNS)",
        clientLocation: "Tokyo, Japan",
        edgePoP: "Tokyo Edge PoP (Local)",
        roundtripLatency: "12 ms (16x Faster!)",
        originLoad: "0% (Origin completely offloaded)",
      },
      visualState: {
        currentStepIndex: 1,
        selectedEdgeId: "tyo",
        isEdgeHit: true,
        assetType: "static",
      } satisfies CdnVisualState,
    },
    {
      narration:
        "Step 3: Edge Cache Miss & Origin Shield. Sydney PoP doesn't have asset cached. It fetches once from Origin Shield and caches locally for future users.",
      activeLine: 12,
      state: {
        architecture: "Edge Cache Miss ➔ Origin Fetch",
        clientLocation: "Sydney, Australia",
        edgePoP: "Sydney PoP (Populating Cache)",
        roundtripLatency: "230 ms (First Request Only)",
        subsequentReads: "14 ms for all future Sydney users",
      },
      visualState: {
        currentStepIndex: 2,
        selectedEdgeId: "syd",
        isEdgeHit: false,
        assetType: "static",
      } satisfies CdnVisualState,
    },
  ],
};
