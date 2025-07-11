import { spawn } from 'child_process';

interface ExecResult {
  stdout: string;
  stderr: string;
  code: number;
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
          resolve({ stdout, stderr, code: code ?? 0 });
        }
      }
    });
  });
}
