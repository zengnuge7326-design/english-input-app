const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { execFile, execSync } = require('child_process')
const fs = require('fs')



// Make Web Audio API behave the same as in Chrome browser
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
app.commandLine.appendSwitch('disable-features', 'AudioServiceSandbox')

// Kill any running say process before speaking new text
let sayProcess = null

ipcMain.handle('tts-speak', (_event, text, rate) => {
  // Kill previous say process if still running
  if (sayProcess) {
    try { sayProcess.kill() } catch {}
    sayProcess = null
  }
  const args = ['-r', String(Math.round((rate || 1.0) * 180))]
  args.push(text)
  sayProcess = execFile('say', args, (err) => {
    sayProcess = null
  })
})

ipcMain.handle('tts-cancel', () => {
  if (sayProcess) {
    try { sayProcess.kill() } catch {}
    sayProcess = null
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

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
