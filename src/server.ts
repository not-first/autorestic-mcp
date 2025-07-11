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

  server.registerTool(
    'list-backends',
    {
      title: 'List Autorestic Backends',
      description: 'Lists the available exact referece names for autorestic backends. You MUST call this tool before calling "get-repository-stats" to see available options for backend names.',
    },
    async () => {
      const backends = getBackends();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ backends }),
        }],
      };
    }
  );

  server.registerTool(
    'get-repository-stats',
    {
      title: 'Get Repository Stats',
      description: 'You MUST call "list-backends" first to get the available exact backend reference names.',
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
