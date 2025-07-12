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

# Future Plans
This project was constructed as an exploration into the construction of mcp servers. It will be expanded on later with more tools and abilities such as:
- Fetching files paths/repository types and configuration settings for autorestic repository
- Different modes for the stats commad (restore-size)
- Information about snapshots
- Information about the latest snapshot
- Health check of repositories
- See contents of snapshots


