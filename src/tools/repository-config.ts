import { z } from 'zod';
import { getBackendConfig, getBackends } from '../autorestic/config.js';

export const getRepositoryConfigInputSchema = z.object({
  backend_name: z.string().describe('Name of the autorestic backend'),
});

export async function getRepositoryConfig(input: { backend_name: string; configPath: string }) {
  const backends = getBackends();
  if (!backends.includes(input.backend_name)) {
    throw new Error(`Backend '${input.backend_name}' not found. Use the 'list-backends' tool to see available backends.`);
  }

  return getBackendConfig(input.backend_name);
}
