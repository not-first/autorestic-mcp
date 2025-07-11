import { z } from 'zod';
import { getBackends } from '../autorestic/config.js';
import { executeAutoresticCommand } from '../autorestic/executor.js';
import { filesize } from 'filesize';

export const getRepositoryStatsInputSchema = z.object({
  backend_name: z.string().describe('Name of the autorestic backend'),
});

export async function getRepositoryStats(input: { backend_name: string; configPath: string }) {
  const backends = getBackends();
  if (!backends.includes(input.backend_name)) {
    throw new Error(`Backend '${input.backend_name}' not found`);
  }

  const result = await executeAutoresticCommand(
    input.configPath,
    input.backend_name,
    ['stats', '--json']
  );

  try {
    const text = result.stdout;
    let endIdx = text.lastIndexOf('}');
    let startIdx = endIdx;
    let braceCount = 0;
    while (startIdx >= 0) {
      if (text[startIdx] === '}') braceCount++;
      if (text[startIdx] === '{') braceCount--;
      if (braceCount === 0 && text[startIdx] === '{') break;
      startIdx--;
    }
    if (endIdx === -1 || startIdx < 0) {
      throw new Error('Could not find complete JSON object in autorestic output');
    }
    const output = text.slice(startIdx, endIdx + 1);
    const parsed = JSON.parse(output);
    return {
      total_size: filesize(parsed.total_size),
      total_file_count: parsed.total_file_count,
      snapshots_count: parsed.snapshots_count,
    };
  } catch (err) {
    throw new Error(`Failed to extract or parse JSON from autorestic output: ${err instanceof Error ? err.message : String(err)}`);
  }
}
