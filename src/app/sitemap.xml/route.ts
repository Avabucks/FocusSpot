import { NextResponse } from "next/server";

const SITE_URL = "https://focusspot.vercel.app";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>${SITE_URL}</loc></url>
        <url><loc>${SITE_URL}/terms</loc></url>
        <url><loc>${SITE_URL}/about</loc></url>
        <url><loc>${SITE_URL}/editor/new</loc></url>
        <url><loc>${SITE_URL}/contact</loc></url>
        <url><loc>${SITE_URL}/login</loc></url>
      </urlset>
    `;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}