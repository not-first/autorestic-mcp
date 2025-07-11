import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getBackends } from './autorestic/config.js';
import {
  getRepositoryStats,
  getRepositoryStatsInputSchema,
} from './tools/repository-stats.js';

export function createServer(configPath: string) {
  const server = new McpServer({
    name: 'autorestic-mcp',
    version: '1.0.0',
  });

  server.registerResource(
    'list_backends',
    'autorestic://backends',
    {
      title: 'Autorestic Backends',
      description: 'List of available autorestic backends',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [{
        uri: 'autorestic://backends',
        text: JSON.stringify(getBackends()),
      }],
    })
  );

  server.registerTool(
    'get_repository_stats',
    {
      title: 'Get Repository Stats',
      description: 'Get statistics for a restic repository backend',
      inputSchema: getRepositoryStatsInputSchema.shape,
    },
    async ({ backend_name }) => {
      const stats = await getRepositoryStats({ backend_name, configPath });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(stats),
        }],
      };
    }
  );

  return server;
}
