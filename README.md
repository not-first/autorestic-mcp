# Autorestic MCP Server

An MCP (Model Context Protocol) server for managing and querying autorestic backup repositories. This server allows AI language models to easily access information about restic repositories through autorestic's command interface.

## Overview

This MCP server provides tools for:
- Listing all repository names
- Getting repository statistics (size, file count, etc.)

## Usage

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

You can integrate the MCP server into your application using the following configuration:

```json
{
  "mcpServers": {
    "autorestic": {
      "command": "npx",
      "args": [
        "autorestic-mcp",
        "/path/to/.autorestic.yml"
      ]
    }
  }
}
```

Replace `/path/to/.autorestic.yml` with the path to your Autorestic configuration file.

## Available Tools

This MCP server exposes the following tools for interacting with Autorestic repositories:

- **list-backends**: Lists the configured backend names from your Autorestic configuration. Call this first to discover valid backend identifiers.
- **get-repository-stats**: Retrieves overall repository statistics for a given backend. Supports an optional `stats_mode` parameter (`default` or `restore-size`) to switch between total stats and size required to restore the repository.
- **get-repository-config**: Returns the full configuration details for a specific backend, including paths, types, and custom settings defined in `.autorestic.yml`.
- **list-snapshots**: Lists all snapshots for a backend, returning snapshot IDs, creation timestamps, and metadata.
- **get-latest-snapshot**: Fetches metadata for the most recent snapshot, including its ID and timestamp.
