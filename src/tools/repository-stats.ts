import { z } from 'zod';
import { getBackends } from '../autorestic/config.js';
import { executeAutoresticCommand } from '../autorestic/executor.js';
import { filesize } from 'filesize';

export const getRepositoryStatsInputSchema = z.object({
  backend_name: z.string().describe('Name of the autorestic backend'),
  stats_mode: z.enum([
    'restore-size',
    'files-by-contents',
    'raw-data',
    'blobs-per-file',
  ]).optional().describe(
    'Mode for stats command. Valid options: "restore-size" (default, size required to restore files), "files-by-contents" (total size of unique files by content), "raw-data" (total size of blobs in the repo), "blobs-per-file" (unique data stored by file, resilient to renames). If not specified, "restore-size" is used.'
  ),
});

export async function getRepositoryStats(input: { backend_name: string; configPath: string; stats_mode?: 'restore-size' | 'files-by-contents' | 'raw-data' | 'blobs-per-file' }) {
  // get the list of backends and check if the backend exists
  const backends = getBackends();
  if (!backends.includes(input.backend_name)) {
    throw new Error(`Backend '${input.backend_name}' not found. Use the 'list-backends' tool to see available backends.`);
  }

  // build stats command with --mode flag
  const mode = input.stats_mode || 'restore-size';
  const args = ['stats', '--json', '--mode', mode];
  const result = await executeAutoresticCommand(
    input.configPath,
    input.backend_name,
    args
  );

  if (!result.json) {
    throw new Error('Failed to extract JSON from autorestic output');
  }
  const parsed = result.json;
  // return formatted stats, handle all possible result shapes
  const out: Record<string, any> = {
    total_size: typeof parsed.total_size === 'number' ? filesize(parsed.total_size) : undefined,
    total_file_count: parsed.total_file_count,
    total_blob_count: parsed.total_blob_count,
    snapshots_count: parsed.snapshots_count,
  };
  Object.keys(out).forEach(k => out[k] === undefined && delete out[k]);
  return out;
}
