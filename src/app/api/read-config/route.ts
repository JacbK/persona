import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import * as yaml from 'js-yaml';
import { isLocalSetupRequest, LOCAL_ONLY_RESPONSE } from '@/lib/local-setup';

export async function GET(request: NextRequest) {
  if (!isLocalSetupRequest(request)) {
    return NextResponse.json(LOCAL_ONLY_RESPONSE, { status: 404 });
  }

  try {
    const configPath = join(process.cwd(), 'profile.yaml');
    const fileContents = await readFile(configPath, 'utf-8');
    const config = yaml.load(fileContents) as Record<string, unknown>;

    return NextResponse.json({
      exists: true,
      config
    });
  } catch {
    // File doesn't exist or can't be read
    return NextResponse.json({
      exists: false,
      config: null
    });
  }
}
