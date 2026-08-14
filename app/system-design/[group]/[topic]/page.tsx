import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOPICS, getGroup, getTopic } from "@/lib/system-design/topics";
import LessonPlaceholder from "@/components/system-design/LessonPlaceholder";

// Networking Fundamentals Lessons
import ClientServerLesson from "@/components/system-design/lessons/ClientServerLesson";
import { clientServerLesson } from "@/lib/system-design/lessons/networking/client-server-architecture";
import IpAddressLesson from "@/components/system-design/lessons/IpAddressLesson";
import { ipAddressLesson } from "@/lib/system-design/lessons/networking/ip-address";
import DnsLesson from "@/components/system-design/lessons/DnsLesson";
import { dnsLesson } from "@/lib/system-design/lessons/networking/dns";
import ProxyReverseProxyLesson from "@/components/system-design/lessons/ProxyReverseProxyLesson";
import { proxyLesson } from "@/lib/system-design/lessons/networking/proxy-reverse-proxy";
import LatencyLesson from "@/components/system-design/lessons/LatencyLesson";
import { latencyLesson } from "@/lib/system-design/lessons/networking/latency";

// Web & APIs Lessons
import HttpHttpsLesson from "@/components/system-design/lessons/HttpHttpsLesson";
import { httpHttpsLesson } from "@/lib/system-design/lessons/web-apis/http-https";
import ApisLesson from "@/components/system-design/lessons/ApisLesson";
import { apisLesson } from "@/lib/system-design/lessons/web-apis/apis";
import RestApiLesson from "@/components/system-design/lessons/RestApiLesson";
import { restApiLesson } from "@/lib/system-design/lessons/web-apis/rest-api";
import GraphqlLesson from "@/components/system-design/lessons/GraphqlLesson";
import { graphqlLesson } from "@/lib/system-design/lessons/web-apis/graphql";
import DatabasesLesson from "@/components/system-design/lessons/DatabasesLesson";
import { databasesLesson } from "@/lib/system-design/lessons/web-apis/databases";

// Scaling Foundations Lessons
import SqlVsNosqlLesson from "@/components/system-design/lessons/SqlVsNosqlLesson";
import { sqlVsNosqlLesson } from "@/lib/system-design/lessons/scaling/sql-vs-nosql";
import VerticalScalingLesson from "@/components/system-design/lessons/VerticalScalingLesson";
import { verticalScalingLesson } from "@/lib/system-design/lessons/scaling/vertical-scaling";
import HorizontalScalingLesson from "@/components/system-design/lessons/HorizontalScalingLesson";
import { horizontalScalingLesson } from "@/lib/system-design/lessons/scaling/horizontal-scaling";
import LoadBalancersLesson from "@/components/system-design/lessons/LoadBalancersLesson";
import { loadBalancersLesson } from "@/lib/system-design/lessons/scaling/load-balancers";

// Database Internals Lessons
import IndexingLesson from "@/components/system-design/lessons/IndexingLesson";
import { indexingLesson } from "@/lib/system-design/lessons/db-internals/indexing";
import ReplicationLesson from "@/components/system-design/lessons/ReplicationLesson";
import { replicationLesson } from "@/lib/system-design/lessons/db-internals/replication";
import ShardingLesson from "@/components/system-design/lessons/ShardingLesson";
import { shardingLesson } from "@/lib/system-design/lessons/db-internals/sharding";
import VerticalPartitioningLesson from "@/components/system-design/lessons/VerticalPartitioningLesson";
import { verticalPartitioningLesson } from "@/lib/system-design/lessons/db-internals/vertical-partitioning";

// Performance & Consistency Lessons
import CachingLesson from "@/components/system-design/lessons/CachingLesson";
import { cachingLesson } from "@/lib/system-design/lessons/perf-consistency/caching";
import DenormalizationLesson from "@/components/system-design/lessons/DenormalizationLesson";
import { denormalizationLesson } from "@/lib/system-design/lessons/perf-consistency/denormalization";
import CapTheoremLesson from "@/components/system-design/lessons/CapTheoremLesson";
import { capTheoremLesson } from "@/lib/system-design/lessons/perf-consistency/cap-theorem";
import BlobStorageLesson from "@/components/system-design/lessons/BlobStorageLesson";
import { blobStorageLesson } from "@/lib/system-design/lessons/perf-consistency/blob-storage";

// Real-Time & Architecture Lessons
import CdnLesson from "@/components/system-design/lessons/CdnLesson";
import { cdnLesson } from "@/lib/system-design/lessons/realtime/cdn";
import WebsocketsLesson from "@/components/system-design/lessons/WebsocketsLesson";
import { websocketsLesson } from "@/lib/system-design/lessons/realtime/websockets";
import WebhooksLesson from "@/components/system-design/lessons/WebhooksLesson";
import { webhooksLesson } from "@/lib/system-design/lessons/realtime/webhooks";
import MicroservicesLesson from "@/components/system-design/lessons/MicroservicesLesson";
import { microservicesLesson } from "@/lib/system-design/lessons/realtime/microservices";

// Reliability & Traffic Lessons
import MessageQueuesLesson from "@/components/system-design/lessons/MessageQueuesLesson";
import { messageQueuesLesson } from "@/lib/system-design/lessons/reliability/message-queues";
import RateLimitingLesson from "@/components/system-design/lessons/RateLimitingLesson";
import { rateLimitingLesson } from "@/lib/system-design/lessons/reliability/rate-limiting";
import ApiGatewaysLesson from "@/components/system-design/lessons/ApiGatewaysLesson";
import { apiGatewaysLesson } from "@/lib/system-design/lessons/reliability/api-gateways";
import IdempotencyLesson from "@/components/system-design/lessons/IdempotencyLesson";
import { idempotencyLesson } from "@/lib/system-design/lessons/reliability/idempotency";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ group: t.group, topic: t.slug }));
}

export async function generateMetadata(
  props: PageProps<"/system-design/[group]/[topic]">
): Promise<Metadata> {
  const { group: groupSlug, topic: topicSlug } = await props.params;
  const topic = getTopic(groupSlug, topicSlug);
  const group = getGroup(groupSlug);
  if (!topic || !group) return {};
  return {
    title: `${topic.title} — System Design Visualizer`,
    description: topic.oneLiner,
  };
}

export default async function TopicPage(
  props: PageProps<"/system-design/[group]/[topic]">
) {
  const { group: groupSlug, topic: topicSlug } = await props.params;

  const topic = getTopic(groupSlug, topicSlug);
  const group = getGroup(groupSlug);
  if (!topic || !group) notFound();

  // ── Group 1: Networking Fundamentals ─────────────────────────────────────
  if (groupSlug === "networking-fundamentals") {
    if (topicSlug === "client-server-architecture") {
      return (
        <ClientServerLesson
          topic={topic}
          group={group}
          lesson={clientServerLesson}
        />
      );
    }
    if (topicSlug === "ip-address") {
      return (
        <IpAddressLesson
          topic={topic}
          group={group}
          lesson={ipAddressLesson}
        />
      );
    }
    if (topicSlug === "dns") {
      return (
        <DnsLesson
          topic={topic}
          group={group}
          lesson={dnsLesson}
        />
      );
    }
    if (topicSlug === "proxy-reverse-proxy") {
      return (
        <ProxyReverseProxyLesson
          topic={topic}
          group={group}
          lesson={proxyLesson}
        />
      );
    }
    if (topicSlug === "latency") {
      return (
        <LatencyLesson
          topic={topic}
          group={group}
          lesson={latencyLesson}
        />
      );
    }
  }

  // ── Group 2: Web & APIs ───────────────────────────────────────────────────
  if (groupSlug === "web-and-apis") {
    if (topicSlug === "http-https") {
      return (
        <HttpHttpsLesson
          topic={topic}
          group={group}
          lesson={httpHttpsLesson}
        />
      );
    }
    if (topicSlug === "apis") {
      return (
        <ApisLesson
          topic={topic}
          group={group}
          lesson={apisLesson}
        />
      );
    }
    if (topicSlug === "rest-api") {
      return (
        <RestApiLesson
          topic={topic}
          group={group}
          lesson={restApiLesson}
        />
      );
    }
    if (topicSlug === "graphql") {
      return (
        <GraphqlLesson
          topic={topic}
          group={group}
          lesson={graphqlLesson}
        />
      );
    }
    if (topicSlug === "databases") {
      return (
        <DatabasesLesson
          topic={topic}
          group={group}
          lesson={databasesLesson}
        />
      );
    }
  }

  // ── Group 3: Scaling Foundations ─────────────────────────────────────────
  if (groupSlug === "scaling-foundations") {
    if (topicSlug === "sql-vs-nosql") {
      return (
        <SqlVsNosqlLesson
          topic={topic}
          group={group}
          lesson={sqlVsNosqlLesson}
        />
      );
    }
    if (topicSlug === "vertical-scaling") {
      return (
        <VerticalScalingLesson
          topic={topic}
          group={group}
          lesson={verticalScalingLesson}
        />
      );
    }
    if (topicSlug === "horizontal-scaling") {
      return (
        <HorizontalScalingLesson
          topic={topic}
          group={group}
          lesson={horizontalScalingLesson}
        />
      );
    }
    if (topicSlug === "load-balancers") {
      return (
        <LoadBalancersLesson
          topic={topic}
          group={group}
          lesson={loadBalancersLesson}
        />
      );
    }
  }

  // ── Group 4: Database Internals ──────────────────────────────────────────
  if (groupSlug === "database-internals") {
    if (topicSlug === "indexing") {
      return (
        <IndexingLesson
          topic={topic}
          group={group}
          lesson={indexingLesson}
        />
      );
    }
    if (topicSlug === "replication") {
      return (
        <ReplicationLesson
          topic={topic}
          group={group}
          lesson={replicationLesson}
        />
      );
    }
    if (topicSlug === "sharding") {
      return (
        <ShardingLesson
          topic={topic}
          group={group}
          lesson={shardingLesson}
        />
      );
    }
    if (topicSlug === "vertical-partitioning") {
      return (
        <VerticalPartitioningLesson
          topic={topic}
          group={group}
          lesson={verticalPartitioningLesson}
        />
      );
    }
  }

  // ── Group 5: Performance & Consistency ────────────────────────────────────
  if (groupSlug === "performance-and-consistency") {
    if (topicSlug === "caching") {
      return (
        <CachingLesson
          topic={topic}
          group={group}
          lesson={cachingLesson}
        />
      );
    }
    if (topicSlug === "denormalization") {
      return (
        <DenormalizationLesson
          topic={topic}
          group={group}
          lesson={denormalizationLesson}
        />
      );
    }
    if (topicSlug === "cap-theorem") {
      return (
        <CapTheoremLesson
          topic={topic}
          group={group}
          lesson={capTheoremLesson}
        />
      );
    }
    if (topicSlug === "blob-storage") {
      return (
        <BlobStorageLesson
          topic={topic}
          group={group}
          lesson={blobStorageLesson}
        />
      );
    }
  }

  // ── Group 6: Real-Time & Architecture ────────────────────────────────────
  if (groupSlug === "realtime-and-architecture") {
    if (topicSlug === "cdn") {
      return (
        <CdnLesson
          topic={topic}
          group={group}
          lesson={cdnLesson}
        />
      );
    }
    if (topicSlug === "websockets") {
      return (
        <WebsocketsLesson
          topic={topic}
          group={group}
          lesson={websocketsLesson}
        />
      );
    }
    if (topicSlug === "webhooks") {
      return (
        <WebhooksLesson
          topic={topic}
          group={group}
          lesson={webhooksLesson}
        />
      );
    }
    if (topicSlug === "microservices") {
      return (
        <MicroservicesLesson
          topic={topic}
          group={group}
          lesson={microservicesLesson}
        />
      );
    }
  }

  // ── Group 7: Reliability & Traffic ───────────────────────────────────────
  if (groupSlug === "reliability-and-traffic") {
    if (topicSlug === "message-queues") {
      return (
        <MessageQueuesLesson
          topic={topic}
          group={group}
          lesson={messageQueuesLesson}
        />
      );
    }
    if (topicSlug === "rate-limiting") {
      return (
        <RateLimitingLesson
          topic={topic}
          group={group}
          lesson={rateLimitingLesson}
        />
      );
    }
    if (topicSlug === "api-gateways") {
      return (
        <ApiGatewaysLesson
          topic={topic}
          group={group}
          lesson={apiGatewaysLesson}
        />
      );
    }
    if (topicSlug === "idempotency") {
      return (
        <IdempotencyLesson
          topic={topic}
          group={group}
          lesson={idempotencyLesson}
        />
      );
    }
  }

  // Fallback for not-yet-built lessons
  return <LessonPlaceholder topic={topic} group={group} />;
}
