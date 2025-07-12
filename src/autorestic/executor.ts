import { spawn } from 'child_process';


export interface ExecResult {
  stdout: string;
  stderr: string;
  code: number;
  json?: any;
}

function extractJson(text: string): any {
  // Find last } or ]
  let endIdx = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
  if (endIdx === -1) throw new Error('No JSON object or array end found');
  let startIdx = endIdx;
  let braceCount = 0;
  let openChar = text[endIdx] === '}' ? '{' : '[';
  let closeChar = text[endIdx];
  while (startIdx >= 0) {
    if (text[startIdx] === closeChar) braceCount++;
    if (text[startIdx] === openChar) braceCount--;
    if (braceCount === 0 && text[startIdx] === openChar) break;
    startIdx--;
  }
  if (endIdx === -1 || startIdx < 0) throw new Error('Could not find complete JSON object or array in output');
  const output = text.slice(startIdx, endIdx + 1);
  return JSON.parse(output);
}

export async function executeAutoresticCommand(
  configPath: string,
  backend: string,
  args: string[],
  timeoutMs = 15000
): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    // set command and arguments
    const cmd = 'autorestic';
    const fullArgs = ['-c', configPath, 'exec', '-v', '-b', backend, '--', ...args];
    // spawn child process
    const child = spawn(cmd, fullArgs, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';
    let finished = false;

    // set timeout for command execution to stop it if it takes too long
    const timer = setTimeout(() => {
      if (!finished) {
        child.kill('SIGKILL');
        finished = true;
        reject(new Error('Command timed out'));
      }
    }, timeoutMs);

    // collect stdout data
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    // collect stderr data
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // handle process error
    child.on('error', (err) => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        reject(new Error(`Failed to start autorestic: ${err}`));
      }
    });

    // handle process close event
    child.on('close', (code) => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        if (code !== 0) {
          reject(new Error(`autorestic exited with code ${code}: ${stderr}`));
        } else {
          let json;
          try {
            json = extractJson(stdout);
          } catch (e: any) {
            reject(new Error(`Failed to extract JSON from output: ${e.message}`));
          }
          resolve({ stdout, stderr, code: code ?? 0, json });
        }
      }
    });
  });
}
