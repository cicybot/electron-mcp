#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const { platform } = require('os');
const path = require('path');

const PORT = 3456; // Port to check

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
  
  const electron = spawn('electron', electronArgs, {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
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

main().catch(console.error);