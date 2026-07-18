import { NextRequest, NextResponse } from 'next/server';
import { writeFile, access, constants } from 'fs/promises';
import { join, dirname } from 'path';
import * as yamlParser from 'js-yaml';
import { isLocalSetupRequest, LOCAL_ONLY_RESPONSE } from '@/lib/local-setup';

const MAX_CONFIG_BYTES = 256 * 1024;

export async function POST(request: NextRequest) {
  if (!isLocalSetupRequest(request)) {
    return NextResponse.json(LOCAL_ONLY_RESPONSE, { status: 404 });
  }

  try {
    const { yaml } = await request.json();

    if (!yaml || typeof yaml !== 'string' || Buffer.byteLength(yaml, 'utf8') > MAX_CONFIG_BYTES) {
      return NextResponse.json({ error: 'Invalid YAML content' }, { status: 400 });
    }

    try {
      const parsed = yamlParser.load(yaml);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Profile must be a YAML object');
      }
    } catch {
      return NextResponse.json({ error: 'YAML could not be parsed' }, { status: 400 });
    }

    // Write to project root
    const filePath = join(process.cwd(), 'profile.yaml');
    const dir = dirname(filePath);

    // Check if directory is writable
    try {
      await access(dir, constants.W_OK);
    } catch {
      return NextResponse.json({ error: 'Project directory is not writable' }, { status: 500 });
    }

    await writeFile(filePath, yaml, 'utf-8');

    // Write sentinel file for setup.sh to detect save completion
    const sentinelPath = join(process.cwd(), '.config-saved');
    await writeFile(sentinelPath, new Date().toISOString(), 'utf-8');

    return NextResponse.json({ success: true, path: 'profile.yaml' });
  } catch (error) {
    console.error('[save-config] Failed to save profile.yaml:', error);
    return NextResponse.json({ error: 'Failed to write profile.yaml' }, { status: 500 });
  }
}
