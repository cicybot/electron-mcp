const { exec } = require('child_process');

const platform = process.platform;
let killCmd;
if (platform === 'win32') {
  killCmd = 'taskkill /f /im electron.exe >nul 2>&1 || true';
} else if (platform === 'darwin') {
  killCmd = 'pkill -f Electron || true';
} else if (platform === 'linux') {
  killCmd = 'pkill -f electron || true';
} else {
  killCmd = 'echo "Unsupported platform"';
}

const commands = [
  killCmd,
  'git add .',
  'git commit -m "no msg"',
  'git push origin mcp',
  'npm start'
];

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(`Stdout: ${stdout}`);
      resolve();
    });
  });
}

async function runAll() {
  for (const cmd of commands) {
    try {
      await runCommand(cmd);
    } catch (error) {
      console.error(`Failed on command: ${cmd}`);
      break;
    }
  }
}

runAll();