import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

// Note: This API route will only work in dev/server mode
// In static export mode, the public/widget.js file will be served directly

export async function GET() {
  // Read the widget.js file from the public directory
  const widgetJsPath = join(process.cwd(), 'public', 'widget.js');
  const widgetJs = readFileSync(widgetJsPath, 'utf8');
  
  // Return the file with the proper content type
  return new NextResponse(widgetJs, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      'Access-Control-Allow-Origin': '*', // Allow CORS
    },
  });
}

// Allow this route to be accessed from other domains (CORS)
export const dynamic = 'force-dynamic';

// This makes sure the route is processed at the edge for better performance
export const runtime = 'edge'; 