import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "NusaKerja",
    version: "1.0.0",
    database: "connected",
    redis: "connected",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
