import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import PDFParser from 'pdf2json';
import { isLocalSetupRequest, LOCAL_ONLY_RESPONSE } from '@/lib/local-setup';
import {
  MaterialFolder,
  sanitizeMaterialName,
  validateMaterialUpload,
} from '@/lib/material-upload';

// Extract text from PDF buffer using pdf2json
async function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', (errData: Error | { parserError: Error }) => {
      reject(errData instanceof Error ? errData : errData.parserError);
    });

    pdfParser.on('pdfParser_dataReady', (pdfData: { Pages?: Array<{ Texts?: Array<{ R?: Array<{ T?: string }> }> }> }) => {
      try {
        // Extract text from all pages
        const text = pdfData.Pages?.map(page => {
          return page.Texts?.map(textItem => {
            return textItem.R?.map(r => decodeURIComponent(r.T || '')).join('') || '';
          }).join(' ') || '';
        }).join('\n\n') || '';

        resolve(text);
      } catch (e) {
        reject(e);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(request: NextRequest) {
  if (!isLocalSetupRequest(request)) {
    return NextResponse.json(LOCAL_ONLY_RESPONSE, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string | null;

    if (!file || (folder !== 'documents' && folder !== 'images')) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const targetFolder: MaterialFolder = folder;
    let safeName: string;
    try {
      safeName = validateMaterialUpload(file, targetFolder);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid file';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const materialsPath = join(process.cwd(), 'materials', targetFolder);

    // Ensure directory exists
    await mkdir(materialsPath, { recursive: true });

    // Get file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = join(materialsPath, safeName);

    await writeFile(filePath, buffer);

    // If it's a PDF, extract text and save as .txt for AI parsing
    let extractedTextPath: string | null = null;
    if (safeName.toLowerCase().endsWith('.pdf')) {
      try {
        const text = await extractPdfText(buffer);
        if (text && text.trim().length > 0) {
          const txtName = safeName.replace(/\.pdf$/i, '.txt');
          const txtPath = join(materialsPath, txtName);
          await writeFile(txtPath, text);
          extractedTextPath = `materials/${targetFolder}/${txtName}`;
        }
      } catch (pdfError) {
        console.error('Failed to extract PDF text:', pdfError);
        // Continue without text extraction - not a fatal error
      }
    }

    return NextResponse.json({
      success: true,
      path: `materials/${targetFolder}/${safeName}`,
      name: safeName,
      extractedText: extractedTextPath
    });
  } catch (error) {
    console.error('Failed to upload file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isLocalSetupRequest(request)) {
    return NextResponse.json(LOCAL_ONLY_RESPONSE, { status: 404 });
  }

  try {
    const { path } = (await request.json()) as { path?: unknown };
    if (typeof path !== 'string') {
      return NextResponse.json({ error: 'Invalid material path' }, { status: 400 });
    }

    const match = path.match(/^materials\/(documents|images)\/([^/]+)$/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid material path' }, { status: 400 });
    }

    const folder = match[1] as MaterialFolder;
    const safeName = sanitizeMaterialName(match[2]);
    if (safeName !== match[2]) {
      return NextResponse.json({ error: 'Invalid material path' }, { status: 400 });
    }

    await unlink(join(process.cwd(), 'materials', folder, safeName));

    if (safeName.toLowerCase().endsWith('.pdf')) {
      const textName = safeName.replace(/\.pdf$/i, '.txt');
      await unlink(join(process.cwd(), 'materials', folder, textName)).catch(() => undefined);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
    if (code === 'ENOENT') {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }
    console.error('Failed to delete material:', error);
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 });
  }
}
