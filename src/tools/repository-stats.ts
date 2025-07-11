import { z } from 'zod';
import { getBackends } from '../autorestic/config.js';
import { executeAutoresticCommand } from '../autorestic/executor.js';
import { ResticStats } from '../autorestic/types.js';

export const repositoryStatsTool = {
  name: 'get_repository_stats',
  inputSchema: z.object({
    backend_name: z.string().describe('Name of the autorestic backend'),
  }),
  outputSchema: z.object({
    total_size: z.number(),
    total_file_count: z.number(),
    snapshot_count: z.number(),
  }),
  run: async (input: { backend_name: string; configPath: string }): Promise<ResticStats> => {
    const backends = getBackends();
    if (!backends.includes(input.backend_name)) {
      throw new Error(`Backend '${input.backend_name}' not found`);
    }
    const result = await executeAutoresticCommand(
      input.configPath,
      input.backend_name,
      ['stats', '--mode', 'raw-size', '--json']
    );
    return JSON.parse(result.stdout);
  },
};
