
import fs from 'fs';
import yaml from 'yaml';

let backendNames: string[] = [];
let fullConfig: any = {};

export function loadBackends(configPath: string): void {
  let fileContent: string;

  try {
    if (!fs.existsSync(configPath)) {
      throw new Error('Config file does not exist');
    }
    fileContent = fs.readFileSync(configPath, 'utf8');
  } catch (err) {
    throw new Error('Failed to read config file. Does the file exist?');
  }

  let parsed: any;
  try {
    parsed = yaml.parse(fileContent);
  } catch (err) {
    throw new Error('Invalid YAML in config');
  }

  // store only backend names for list-backends
  if (!parsed.backends || typeof parsed.backends !== 'object') {
    throw new Error('Config validation error: backends section is missing or invalid');
  }
  backendNames = Object.keys(parsed.backends);
  // store the full config for repository-config
  fullConfig = parsed;
}

export function getBackends(): string[] {
  return backendNames;
}

// Retrieve configuration for a specific backend (returns the backend config from the full file)
export function getBackendConfig(backendName: string): any {
  if (!fullConfig.backends || typeof fullConfig.backends !== 'object') {
    throw new Error('No backends found in config');
  }
  const config = fullConfig.backends[backendName];
  if (!config) {
    throw new Error(`Backend '${backendName}' not found`);
  }
  return config;
}
