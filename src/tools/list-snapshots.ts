import { z } from 'zod';
import { executeAutoresticCommand } from '../autorestic/executor.js';
import { getBackends } from '../autorestic/config.js';

export const listSnapshotsInputSchema = z.object({
  backend_name: z.string().describe('Name of the autorestic backend'),
});

export async function listSnapshots(input: { backend_name: string; configPath: string }) {
  const backends = getBackends();
  if (!backends.includes(input.backend_name)) {
    throw new Error(`Backend '${input.backend_name}' not found. Use 'list-backends' tool.`);
  }
  const result = await executeAutoresticCommand(
    input.configPath,
    input.backend_name,
    ['snapshots', '--json']
  );
  try {
    const parsed = JSON.parse(result.stdout);
    return parsed.snapshots || parsed;
  } catch (err) {
    throw new Error(`Failed to parse snapshots JSON: ${err}`);
  }
}
