# Autorestic MCP Server

> [!IMPORTANT]
> This MCP server assumes you have correctly set up [autorestic](https://autorestic.vercel.app/) on your machine, and have a valid pre-existing config file.

An MCP (Model Context Protocol) server for managing and querying autorestic backup repositories. This server allows AI language models to easily access information about restic repositories through autorestic's command interface.

## Available Tools

This MCP server exposes the following tools for interacting with Autorestic repositories:

- **list-backends**: Lists the configured backend names from your Autorestic configuration. Call this first to discover valid backend identifiers.
- **get-repository-stats**: Retrieves overall repository statistics for a given backend.
- **get-repository-config**: Returns the full configuration details for a specific backend, including paths, types, and custom settings defined in `.autorestic.yml`.
- **list-snapshots**: Lists all snapshots for a backend, returning snapshot IDs, creation timestamps, and metadata.
- **get-latest-snapshot**: Fetches metadata for the most recent snapshot, including its ID and timestamp.

## Usage
> [!WARNING]
> These instructions assume you already have [autorestic](https://autorestic.vercel.app/) set up and functioning on your machine. If you don't, see the [full Setup](#full-setup) section.

To install the package globally, run:

```bash
npm install -g autorestic-mcp
autorestic-mcp /path/to/.autorestic.yml

```

Alternatively, you can use it without global installation via `npx`:

```bash
npx autorestic-mcp /path/to/.autorestic.yml
```

## Example Configuration

You can integrate the MCP server into any supported services by using their configuration. For VSCode, use:

```json
{
	"servers": {
		"autorestic": {
			"command": "npx",
			"args": [
				"autorestic-mcp",
				"/path/to/.autorestic.yml"
			],
			"type": "stdio"
		}
	}
}
```

Replace `/path/to/.autorestic.yml` with the path to your Autorestic configuration file.

## Full Setup (For Demo Testing)
1. Install autorestic using `wget -qO - https://raw.githubusercontent.com/cupcakearmy/autorestic/master/install.sh | bash`
2. Create a new file in `~/.autorestic.yml` and add this content:
```yaml
locations:
  mydata:
    from: FOLDER/TO/BACKUP/HERE
    to: local

backends:
  local:
    type: local
    path: FOLDER/TO/STORE/BACKUPS/HERE
```
3. Run `autorestic check` to initialise the restic repository. *Due to a bug in the software, it may add a key called `forgetoption` into your config file. If it does, simply remove it.*
4. Done! Continue with the usage instructions above.