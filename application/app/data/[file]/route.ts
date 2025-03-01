import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { file: string } }
) {
  const { file } = params;
  
  // Security check: Only allow .json files
  if (!file.endsWith('.json') && !file.includes('.')) {
    // If no extension provided, assume .json
    params.file = `${file}.json`;
  }
  
  // Only allow access to specific JSON files
  const filePath = join(process.cwd(), 'public', 'data', params.file);
  
  // Check if file exists
  if (!existsSync(filePath)) {
    return new NextResponse(JSON.stringify({ error: 'File not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  try {
    // Read the file
    const fileContent = readFileSync(filePath, 'utf8');
    
    // Return the file content with the proper content type
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*', // Allow CORS
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to read file' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Allow this route to be accessed from other domains (CORS)
export const dynamic = 'force-dynamic';

// Edge runtime for better performance
export const runtime = 'edge'; 