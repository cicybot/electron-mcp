// Test harness: ensures Electron backend is running, then exercises a minimal RPC call.
// Before tests: if Electron backend is not started on port 3456, start it via `npm start` in app/

const http = require('http')
const net = require('net')
const path = require('path')
const { spawn } = require('child_process')

function postRpc(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload)
    const options = {
      hostname: '127.0.0.1',
      port: 3456,
      path: '/rpc',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }
    const req = http.request(options, (res) => {
      let body = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch {
          resolve(body)
        }
      })
    })
    req.on('error', (err) => reject(err))
    req.write(data)
    req.end()
  })
}

async function isPortOpen(port) {
  return new Promise((resolve) => {
    const s = net.connect({ port }, () => {
      s.end()
      resolve(true)
    })
    s.on('error', () => resolve(false))
    setTimeout(() => {
      try { s.destroy() } catch {}
      resolve(false)
    }, 1000)
  })
}

async function ensureBackendUp() {
  // If port already open, nothing to do
  if (await isPortOpen(3456)) return
  // Otherwise start the backend in app/ via npm start
  const appDir = path.resolve(__dirname, '..')
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['start'], { cwd: appDir, shell: true, stdio: 'inherit' })
    proc.on('error', (err) => reject(err))
    const timeout = setTimeout(() => reject(new Error('Backend start timeout')), 60000)
    const waitFor = setInterval(async () => {
      if (await isPortOpen(3456)) {
        clearInterval(waitFor)
        clearTimeout(timeout)
        resolve()
      }
    }, 500)
  })
}

describe('Electron test harness (RPC)', () => {
  beforeAll(async () => {
    await ensureBackendUp()
  })

  test('RPC /rpc responds to a sample call', async () => {
    const resp = await postRpc({ method: 'getWindows', params: {} })
    expect(resp).toBeDefined()
    expect(typeof resp).toBe('object')
  })
})
