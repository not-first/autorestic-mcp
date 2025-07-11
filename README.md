# Autorestic MCP Server

An MCP (Model Context Protocol) server for managing and querying autorestic backup repositories. This server allows AI language models to easily access information about restic repositories through autorestic's configuration and command interface.

## Overview

This MCP server provides tools for:
- Listing available autorestic backends
- Getting repository statistics (size, blob count, etc.)
- Querying backup repository information through autorestic's simplified interface

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
autorestic-mcp /path/to/.autorestic.yml
```

## Autorestic MCP Server

This is an MCP (Model Context Protocol) server for autorestic backup repositories.

### Features
- List available autorestic backends
- Get repository statistics (size, file count, snapshot count)

### Usage

1. Build the project:
   ```bash
   npm install
   npm run build
   ```

2. Run the server:
   ```bash
   node build/index.js /path/to/.autorestic.yml
   ```

The server will start and expose MCP tools for listing backends and getting repository stats.