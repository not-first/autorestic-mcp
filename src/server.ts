import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getBackends } from './autorestic/config.js';
import { getRepositoryStats, getRepositoryStatsInputSchema } from './tools/repository-stats.js';
import { getRepositoryConfig, getRepositoryConfigInputSchema } from './tools/repository-config.js';
import { listSnapshots, listSnapshotsInputSchema } from './tools/list-snapshots.js';
import { getLatestSnapshot, getLatestSnapshotInputSchema } from './tools/latest-snapshot.js';

export function createServer(configPath: string) {
  const server = new McpServer({
    name: 'autorestic-mcp',
    version: '1.2.0',
  });

 // list available autorestic backends
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

  // get the repository stats for a specific backend
  server.registerTool(
    'get-repository-stats',
    {
      title: 'Get Repository Stats',
      description:
        'Retrieves statistics for a given autorestic backend. You MUST call "list-backends" first to get valid backend names.\n' +
        'The "stats_mode" option controls what is counted: "restore-size" (default, size required to restore files), "files-by-contents" (total size of unique files by content), "raw-data" (total size of blobs in the repo), "blobs-per-file" (unique data stored by file, resilient to renames). Results differ by mode. If unsure, use "restore-size".',
      inputSchema: getRepositoryStatsInputSchema.shape,
    },
    async (input: { backend_name: string; stats_mode?: 'restore-size' | 'files-by-contents' | 'raw-data' | 'blobs-per-file' }) => {
      const { backend_name, stats_mode } = input;
      const stats = await getRepositoryStats({ backend_name, configPath, stats_mode });
      return { content: [{ type: 'text', text: JSON.stringify(stats) }] };
    }
  );

  // retrieve detailed configuration for a specific backend
  server.registerTool(
    'get-repository-config',
    {
      title: 'Get Repository Configuration',
      description: 'Fetches the configuration settings for a specific autorestic backend, including repository paths, types, and other settings.',
      inputSchema: getRepositoryConfigInputSchema.shape,
    },
    async (input: { backend_name: string }) => {
      const { backend_name } = input;
      const config = await getRepositoryConfig({ backend_name, configPath });
      return { content: [{ type: 'text', text: JSON.stringify(config) }] };
    }
  );

  // list all snapshots in the repository
  server.registerTool(
    'list-snapshots',
    {
      title: 'List Snapshots',
      description: 'Returns a list of all snapshots for the specified backend, including IDs, timestamps, and metadata.',
      inputSchema: listSnapshotsInputSchema.shape,
    },
    async (input: { backend_name: string }) => {
      const { backend_name } = input;
      const snaps = await listSnapshots({ backend_name, configPath });
      return { content: [{ type: 'text', text: JSON.stringify(snaps) }] };
    }
  );

  // get the most recent snapshot
  server.registerTool(
    'get-latest-snapshot',
    {
      title: 'Get Latest Snapshot',
      description: 'Retrieves metadata for the most recent snapshot in the repository, including timestamp and snapshot ID.',
      inputSchema: getLatestSnapshotInputSchema.shape,
    },
    async (input: { backend_name: string }) => {
      const { backend_name } = input;
      const latest = await getLatestSnapshot({ backend_name, configPath });
      return { content: [{ type: 'text', text: JSON.stringify(latest) }] };
    }
  );


  return server;
}
