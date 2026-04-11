const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('nativeTTS', {
  speak: (text, rate) => ipcRenderer.invoke('tts-speak', text, rate),
  cancel: () => ipcRenderer.invoke('tts-cancel'),
})

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  // ASR methods
  sendAudio: (buffer) => ipcRenderer.send('asr-send-audio', buffer),
  stopASR: () => ipcRenderer.send('asr-stop'),
  onPartialResult: (callback) => ipcRenderer.on('asr-partial', (_event, data) => callback(data)),
  onResult: (callback) => ipcRenderer.on('asr-result', (_event, data) => callback(data)),
  onFinalResult: (callback) => ipcRenderer.on('asr-final', (_event, data) => callback(data)),
})
