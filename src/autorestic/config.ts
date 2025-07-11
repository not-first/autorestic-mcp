
import fs from 'fs';
import yaml from 'yaml';
import { BackendsSchema } from './types.js';

let backends: string[] = [];

export function loadBackends(configPath: string): void {
  let fileContent: string;

  try {
    if (!fs.existsSync(configPath)) {
      throw new Error('Config file does not exist');
    }
    const stat = fs.statSync(configPath);
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

  const result = BackendsSchema.safeParse(parsed.backends);
  if (!result.success) {
    throw new Error('Config validation error: backends section is missing or invalid');
  }

  backends = Object.keys(result.data);
}

export function getBackends(): string[] {
  return backends;
}
