import { NextResponse } from "next/server";

export async function GET() {
  return new Response("Hello world!", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
