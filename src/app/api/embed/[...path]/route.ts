import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/');
    const fullPath = join(process.cwd(), 'public', 'embed', filePath);
    
    // Security check - only allow specific file types
    const allowedExtensions = ['.js', '.css', '.html'];
    const hasAllowedExtension = allowedExtensions.some(ext => filePath.endsWith(ext));
    
    if (!hasAllowedExtension) {
      return new NextResponse('File type not allowed', { status: 403 });
    }
    
    const fileContent = await readFile(fullPath, 'utf-8');
    
    // Set appropriate content type based on file extension
    let contentType = 'text/plain';
    if (filePath.endsWith('.js')) {
      contentType = 'application/javascript';
    } else if (filePath.endsWith('.css')) {
      contentType = 'text/css';
    } else if (filePath.endsWith('.html')) {
      contentType = 'text/html';
    }
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error serving embed file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
