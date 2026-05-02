const { app, BrowserWindow, ipcMain, systemPreferences } = require('electron')
const path = require('path')
const { execFile, execSync, spawn } = require('child_process')
const crypto = require('crypto')
const fs = require('fs')
let vosk = null
try {
  vosk = require('vosk')
  vosk.setLogLevel(-1) // Disable verbose logging
} catch (err) {
  console.error('❌ Vosk module failed to load:', err.message)
}



// Make Web Audio API behave the same as in Chrome browser
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
app.commandLine.appendSwitch('disable-features', 'AudioServiceSandbox')

// Global state for ASR 
let model = null
let recognizer = null
let sayProcess = null
let edgeProcess = null
const edgeWarmTasks = new Map()

const EDGE_DEFAULT_VOICE = 'en-US-AvaNeural'
const EDGE_TIMEOUT_MS = 12000

function resolveEdgeTTSCommand() {
  const candidates = []
  if (process.env.EDGE_TTS_BIN) candidates.push(process.env.EDGE_TTS_BIN)
  const appRoot = app.getAppPath()
  candidates.push(path.join(appRoot, '.venv-edgetts', 'bin', 'edge-tts'))
  candidates.push(path.join(appRoot, '.venv', 'bin', 'edge-tts'))
  candidates.push('edge-tts')
  for (const cmd of candidates) {
    if (cmd === 'edge-tts') return cmd
    if (fs.existsSync(cmd)) return cmd
  }
  return 'edge-tts'
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function getTTSCacheDir() {
  const dir = path.join(app.getPath('userData'), 'tts-cache')
  ensureDir(dir)
  return dir
}

function normalizeTTSKey(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cacheKey(text, voice, rate) {
  const payload = `${normalizeTTSKey(text)}|${voice || EDGE_DEFAULT_VOICE}|${String(rate || 1)}`
  return crypto.createHash('sha256').update(payload).digest('hex')
}

function edgeRateArg(rate = 1) {
  const pct = Math.max(-50, Math.min(100, Math.round((rate - 1) * 100)))
  return `${pct >= 0 ? '+' : ''}${pct}%`
}

function resolveDistAsset(assetPath = '') {
  const clean = String(assetPath).replace(/^\/+/, '')
  return path.join(app.getAppPath(), 'dist', clean)
}

function stopNativeSpeakProcess() {
  if (sayProcess) {
    try { sayProcess.kill() } catch {}
    sayProcess = null
  }
}

function stopEdgeProcess() {
  if (edgeProcess) {
    try { edgeProcess.kill() } catch {}
    edgeProcess = null
  }
}

function synthesizeEdgeToFile(text, voice, rate, filePath, timeoutMs = EDGE_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const edgeCmd = resolveEdgeTTSCommand()
    const args = [
      '--voice', voice || EDGE_DEFAULT_VOICE,
      '--text', text,
      '--rate', edgeRateArg(rate),
      '--write-media', filePath,
    ]
    const child = spawn(edgeCmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    edgeProcess = child
    let stderr = ''
    let done = false
    const timer = setTimeout(() => {
      if (done) return
      done = true
      try { child.kill() } catch {}
      edgeProcess = null
      reject(new Error('edge_timeout'))
    }, timeoutMs)

    child.stderr.on('data', (buf) => { stderr += String(buf || '') })
    child.on('error', (err) => {
      if (done) return
      done = true
      clearTimeout(timer)
      edgeProcess = null
      reject(err)
    })
    child.on('close', (code) => {
      if (done) return
      done = true
      clearTimeout(timer)
      edgeProcess = null
      if (code === 0 && fs.existsSync(filePath)) resolve(filePath)
      else reject(new Error(stderr || `edge_exit_${code}`))
    })
  })
}

function warmEdgeCache(text, voice, rate) {
  const key = cacheKey(text, voice, rate)
  if (edgeWarmTasks.has(key)) return edgeWarmTasks.get(key)
  const filePath = path.join(getTTSCacheDir(), `${key}.mp3`)
  if (fs.existsSync(filePath)) return Promise.resolve({ key, filePath, cached: true })
  const task = synthesizeEdgeToFile(text, voice, rate, filePath)
    .then(() => ({ key, filePath, cached: false }))
    .finally(() => edgeWarmTasks.delete(key))
  edgeWarmTasks.set(key, task)
  return task
}

ipcMain.handle('tts-speak', (_event, text, rate) => {
  stopNativeSpeakProcess()

  if (process.platform === 'darwin') {
    // macOS native TTS
    const args = ['-r', String(Math.round((rate || 1.0) * 180))]
    args.push(text)
    sayProcess = execFile('say', args, (err) => {
      sayProcess = null
    })
  } else if (process.platform === 'win32') {
    // Windows PowerShell TTS
    const psCommand = `Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('${text.replace(/'/g, "''")}');`
    sayProcess = execFile('powershell', ['-Command', psCommand], (err) => {
      sayProcess = null
    })
  }
})

ipcMain.handle('tts-cancel', () => {
  stopNativeSpeakProcess()
  stopEdgeProcess()
})

ipcMain.handle('tts-resolve-asset-url', (_event, assetPath) => {
  const abs = resolveDistAsset(assetPath)
  if (!fs.existsSync(abs)) return null
  return `file://${abs}`
})

ipcMain.handle('tts-probe-edge', async () => {
  try {
    const cmd = resolveEdgeTTSCommand()
    const out = execSync(`"${cmd}" --version`, { timeout: 3000 })
    return { ok: true, info: String(out || '').trim() || 'edge-tts available' }
  } catch (err) {
    return { ok: false, error: err?.message || 'edge-tts unavailable' }
  }
})

ipcMain.handle('tts-cache-stats', () => {
  const dir = getTTSCacheDir()
  let files = 0
  let bytes = 0
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.mp3')) continue
    const stat = fs.statSync(path.join(dir, name))
    if (!stat.isFile()) continue
    files += 1
    bytes += stat.size
  }
  return { dir, files, bytes }
})

ipcMain.handle('tts-cache-clear', () => {
  const dir = getTTSCacheDir()
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.mp3')) continue
    try { fs.unlinkSync(path.join(dir, name)) } catch {}
  }
  return { ok: true }
})

ipcMain.handle('tts-speak-hybrid', async (_event, payload) => {
  const text = String(payload?.text || '').trim()
  const rate = Number(payload?.rate || 1)
  const voice = String(payload?.voice || EDGE_DEFAULT_VOICE)
  if (!text) return { ok: false, layer: 'none', reason: 'empty_text' }

  // L2: Edge Neural — wait for synthesis (edge-tts is local, fast enough to block)
  try {
    const result = await warmEdgeCache(text, voice, rate)
    if (result?.filePath && fs.existsSync(result.filePath)) {
      return { ok: true, layer: result.cached ? 'L2-cache' : 'L2-edge', audioUrl: `file://${result.filePath}` }
    }
  } catch (err) {
    // edge-tts failed → fall through to system TTS
  }

  // L3: native system TTS fallback
  try {
    stopNativeSpeakProcess()
    if (process.platform === 'darwin') {
      const args = ['-r', String(Math.round((rate || 1.0) * 180))]
      args.push(text)
      sayProcess = execFile('say', args, () => { sayProcess = null })
      return { ok: true, layer: 'L3-system' }
    }
    if (process.platform === 'win32') {
      const psCommand = `Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('${text.replace(/'/g, "''")}');`
      sayProcess = execFile('powershell', ['-Command', psCommand], () => { sayProcess = null })
      return { ok: true, layer: 'L3-system' }
    }
  } catch (err) {
    return { ok: false, layer: 'L3-system', reason: err?.message || 'system_tts_failed' }
  }

  return { ok: false, layer: 'L3-system', reason: 'unsupported_platform' }
})

ipcMain.handle('tts-prefetch-hybrid', async (_event, payload) => {
  const text = String(payload?.text || '').trim()
  const rate = Number(payload?.rate || 1)
  const voice = String(payload?.voice || EDGE_DEFAULT_VOICE)
  if (!text) return { ok: false, reason: 'empty_text' }
  try {
    const key = cacheKey(text, voice, rate)
    const filePath = path.join(getTTSCacheDir(), `${key}.mp3`)
    if (fs.existsSync(filePath)) return { ok: true, layer: 'L2-cache' }
    await warmEdgeCache(text, voice, rate)
    return { ok: true, layer: 'L2-edge' }
  } catch (err) {
    return { ok: false, reason: err?.message || 'prefetch_failed' }
  }
})

// Vosk Offline ASR IPC Handlers
ipcMain.on('asr-send-audio', (event, buffer) => {
  if (!vosk) return;
  
  try {
    if (!model) {
      const modelPath = path.join(__dirname, 'model')
      if (fs.existsSync(modelPath)) {
        model = new vosk.Model(modelPath)
        console.log('✅ Vosk model loaded successfully from:', modelPath)
      } else {
        console.error('❌ Vosk model directory not found at:', modelPath)
        return
      }
    }

    if (!recognizer) {
      recognizer = new vosk.Recognizer({ model: model, sampleRate: 16000 })
    }

    if (recognizer.acceptWaveform(Buffer.from(buffer))) {
      const result = recognizer.result()
      event.sender.send('asr-result', result)
    } else {
      const partial = recognizer.partialResult()
      event.sender.send('asr-partial', partial)
    }
  } catch (err) {
    console.error('❌ ASR processing error:', err)
  }
})

ipcMain.on('asr-stop', (event) => {
  if (recognizer) {
    const final = recognizer.finalResult()
    event.sender.send('asr-final', final)
    // We don't destroy the recognizer to keep it ready for next time
    // but we can if we want to save memory: 
    // recognizer.free(); recognizer = null;
  }
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '..', 'build', 'icon.icns'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  const distIndex = path.join(__dirname, '..', 'dist', 'index.html')
  if (fs.existsSync(distIndex)) {
    win.loadFile(distIndex)
  } else {
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(
      '<h2 style="font-family:sans-serif">dist/index.html 不存在</h2><p>请先执行 npm run build 后再启动 Electron。</p>'
    ))
  }

  win.webContents.on('did-fail-load', (_event, code, desc, url) => {
    console.error('❌ Renderer load failed:', code, desc, url)
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(
      `<h2 style="font-family:sans-serif">页面加载失败</h2><p>code: ${code}</p><p>${String(desc || '')}</p><p>${String(url || '')}</p>`
    ))
  })

  // Handle permission requests (like microphone)
  win.webContents.session.setPermissionCheckHandler((_webContents, permission) => {
    if (permission === 'media') return true;
    return false;
  });

  win.webContents.session.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'media') callback(true);
    else callback(false);
  });
}


// Function to check and ask for microphone permission on macOS

async function checkAndAskMicrophonePermission() {
  if (process.platform === 'darwin') {
    try {
      const status = systemPreferences.getMediaAccessStatus('microphone')
      console.log('🎤 Current microphone access status:', status)
      if (status !== 'granted') {
        const result = await systemPreferences.askForMediaAccess('microphone')
        console.log('🎤 Microphone access request result:', result)
      }
    } catch (err) {
      console.error('❌ Error checking microphone permission:', err)
    }
  }
}

app.whenReady().then(async () => {
  createWindow()
  checkAndAskMicrophonePermission().catch(() => {})

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
