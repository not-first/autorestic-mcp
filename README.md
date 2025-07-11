# Autorestic MCP Server

An MCP (Model Context Protocol) server for managing and querying autorestic backup repositories. This server allows AI language models to easily access information about restic repositories through autorestic's command interface.

## Overview

This MCP server provides tools for:
- Getting repository statistics (size, file count, etc.)

## Installation

To install the package globally, run:

```bash
npm install -g autorestic-mcp
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

## Usage

To start the MCP server manually, run:

```bash
autorestic-mcp /path/to/.autorestic.yml
```

