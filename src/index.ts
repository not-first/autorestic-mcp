import { loadBackends } from './autorestic/config.js';
import { createServer } from './server.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const configPath = process.argv[2];
if (!configPath) {
  console.error('Usage: autorestic-mcp <config-file-path>');
  process.exit(1);
}

loadBackends(configPath);

async function main() {
  const server = createServer(configPath);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Server error:', err);
  process.exit(1);
});