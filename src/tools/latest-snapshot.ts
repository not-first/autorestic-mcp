import { z } from 'zod';
import { listSnapshots } from './list-snapshots.js';

export const getLatestSnapshotInputSchema = z.object({
  backend_name: z.string().describe('Name of the autorestic backend'),
});

export async function getLatestSnapshot(input: { backend_name: string; configPath: string }) {
  const snaps = await listSnapshots(input);
  if (!Array.isArray(snaps) || snaps.length === 0) {
    throw new Error('No snapshots found');
  }
  // assuming snapshots sorted by time desc
  return snaps[0];
}
