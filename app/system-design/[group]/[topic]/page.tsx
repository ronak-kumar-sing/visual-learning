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

  // Fallback for not-yet-built lessons
  return <LessonPlaceholder topic={topic} group={group} />;
}
