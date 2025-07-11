/
├── index.ts                    # Main MCP server entry point
├── config/
│   ├── reader.ts              # Autorestic config file reader (.autorestic.yml)
│   └── types.ts               # TypeScript interfaces for config structure
├── autorestic/
│   ├── executor.ts            # Wrapper for `autorestic exec` command execution
│   └── backends.ts            # Backend management and validation
├── tools/
│   └── get-repository-stats.ts # MCP tool implementation for `restic stats`
└── utils/
    ├── validation.ts          # Input validation helpers
    └── errors.ts              # Custom error types