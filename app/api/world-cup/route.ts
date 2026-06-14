import { NextResponse } from "next/server";
import { buildWorldCupFeed } from "@/lib/feed-service";
import type { WorldCupFeedPayload } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<WorldCupFeedPayload>> {
  const feedPayload = await buildWorldCupFeed();
  return NextResponse.json(feedPayload);
}
