#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const { platform } = require('os');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const PORT = args.includes('--port') ? parseInt(args[args.indexOf('--port') + 1]) : 3456;
const USE_XVFB = args.includes('--xvfb');

function checkPort(port) {
  return new Promise((resolve) => {
    const command = platform() === 'linux' 
      ? `netstat -tlnp | grep :${port} || ss -tlnp | grep :${port}`
      : platform() === 'darwin'
      ? `lsof -i :${port}`
      : `netstat -ano | findstr :${port}`;
    
    exec(command, (error, stdout) => {
      resolve(!error && stdout.trim().length > 0);
    });
  });
}

function killPortProcess(port) {
  return new Promise((resolve) => {
    const command = platform() === 'linux'
      ? `fuser -k ${port}/tcp 2>/dev/null || true`
      : platform() === 'darwin'
      ? `lsof -ti:${port} | xargs kill -9 2>/dev/null || true`
      : `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /F /PID %a 2>nul`;
    
    exec(command, () => {
      resolve();
    });
  });
}

async function waitForPortFree(port, maxAttempts = 10, delay = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    const isOccupied = await checkPort(port);
    if (!isOccupied) {
      console.log(`Port ${port} is now free`);
      return true;
    }
    console.log(`Waiting for port ${port} to be free... (${i + 1}/${maxAttempts})`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  console.log(`Timeout waiting for port ${port} to be free`);
  return false;
}

function checkXvfbInstalled() {
  return new Promise((resolve) => {
    exec('which xvfb-run', (error, stdout) => {
      resolve(!error && stdout.trim().length > 0);
    });
  });
}

function installXvfb() {
  return new Promise((resolve, reject) => {
    console.log('Installing Xvfb...');
    
    // Try different package managers
    const commands = [
      'sudo apt-get update && sudo apt-get install -y xvfb',
      'sudo yum install -y xorg-x11-server-Xvfb',
      'sudo dnf install -y xorg-x11-server-Xvfb'
    ];
    
    let attempts = 0;
    
    function tryNextCommand() {
      if (attempts >= commands.length) {
        reject(new Error('Failed to install Xvfb with available package managers'));
        return;
      }
      
      const command = commands[attempts];
      console.log(`Trying: ${command}`);
      
      exec(command, (error, stdout, stderr) => {
        if (!error) {
          console.log('Xvfb installed successfully');
          resolve();
        } else {
          attempts++;
          tryNextCommand();
        }
      });
    }
    
    tryNextCommand();
  });
}

function startElectron() {
  const electronArgs = [];
  
  if (platform() === 'linux') {
    electronArgs.push(
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    );
  }
  
  // Add the main script as the last argument
  electronArgs.push(path.join(__dirname, '../src/main.js'));
  
  let command = 'electron';
  const spawnOptions = {
    stdio: 'inherit',
    env: { ...process.env, DISPLAY: USE_XVFB ? ':99' : process.env.DISPLAY }
  };
  
  // Use xvfb-run if requested and on Linux
  if (platform() === 'linux' && USE_XVFB) {
    command = 'xvfb-run';
    electronArgs.unshift('--auto-servernum', '--server-args=-screen 0 1024x768x24', 'electron');
  }
  
  const electron = spawn(command, electronArgs, spawnOptions);
  
  electron.on('error', (error) => {
    console.error('Failed to start Electron:', error.message);
    process.exit(1);
  });
  
  electron.on('close', (code) => {
    console.log(`Electron exited with code ${code}`);
    process.exit(code);
  });
}

async function main() {
  console.log('Starting Electron application...');
  console.log(`Using port: ${PORT}`);
  console.log(`Platform: ${platform()}`);
  
  // Check and install Xvfb if needed (Linux only)
  if (platform() === 'linux' && USE_XVFB) {
    const xvfbInstalled = await checkXvfbInstalled();
    if (!xvfbInstalled) {
      try {
        await installXvfb();
        console.log('Xvfb is now available');
      } catch (error) {
        console.error('Failed to install Xvfb:', error.message);
        console.log('Continuing without Xvfb...');
      }
    } else {
      console.log('Xvfb is already installed');
    }
  }
  
  // Check if port is occupied
  const isPortOccupied = await checkPort(PORT);
  
  if (isPortOccupied) {
    console.log(`Port ${PORT} is occupied. Killing process...`);
    await killPortProcess(PORT);
    
    // Wait for port to be free
    const isFree = await waitForPortFree(PORT);
    if (!isFree) {
      console.error(`Could not free port ${PORT}. Exiting.`);
      process.exit(1);
    }
  } else {
    console.log(`Port ${PORT} is free`);
  }
  
  // Start Electron
  startElectron();
}

// Show usage information
function showUsage() {
  console.log(`
Usage: node start.sh [options]

Options:
  --port <number>    Specify port to check (default: 3456)
  --xvfb             Use Xvfb on Linux (installs if not available)
  --help             Show this help message

Examples:
  node start.sh --port 8080
  node start.sh --xvfb
  node start.sh --port 8080 --xvfb
  `);
}

// Handle help flag
if (args.includes('--help') || args.includes('-h')) {
  showUsage();
  process.exit(0);
}

main().catch(console.error);