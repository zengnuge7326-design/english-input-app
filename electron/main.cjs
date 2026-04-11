const { app, BrowserWindow, ipcMain, systemPreferences, protocol, net } = require('electron')
const path = require('path')
const { execFile, execSync } = require('child_process')
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

ipcMain.handle('tts-speak', (_event, text, rate) => {
  if (sayProcess) {
    try { sayProcess.kill() } catch {}
    sayProcess = null
  }

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
  if (sayProcess) {
    try { sayProcess.kill() } catch {}
    sayProcess = null
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
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))

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
  // Intercept absolute paths like /logo.png used in the React app
  // This allows the app to find /logo.png in the dist folder without changing React source code
  protocol.handle('file', (request) => {
    const url = request.url
    if (url.endsWith('/logo.png') && !url.includes('/dist/')) {
      const filePath = path.join(app.getAppPath(), 'dist', 'logo.png')
      return net.fetch('file://' + filePath)
    }
    return net.fetch(url)
  })

  await checkAndAskMicrophonePermission()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
