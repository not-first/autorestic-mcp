import { z } from 'zod';
import { getBackendConfig } from '../autorestic/config.js';

export const getRepositoryConfigInputSchema = z.object({
  backend_name: z.string().describe('Name of the autorestic backend'),
});

export async function getRepositoryConfig(input: { backend_name: string; configPath: string }) {
  // Validate backend exists
  const config = getBackendConfig(input.backend_name);
  return config;
}
