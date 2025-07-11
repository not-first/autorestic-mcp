# Autorestic MCP Server

An MCP (Model Context Protocol) server for managing and querying autorestic backup repositories. This server allows AI language models to easily access information about restic repositories through autorestic's command interface.

## Overview

This MCP server provides tools for:
- Listing available autorestic backends
- Getting repository statistics (size, blob count, etc.)

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
autorestic-mcp /path/to/.autorestic.yml
```