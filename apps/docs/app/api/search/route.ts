import { NextResponse } from "next/server";
import path from "path";
import { searchDocs } from "@repo/docs-core";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  const contentDir = path.join(process.cwd(), "content");
  const results = searchDocs(contentDir, query);

  return NextResponse.json({ results });
}
