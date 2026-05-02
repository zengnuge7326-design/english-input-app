const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('nativeTTS', {
  speak: (text, rate) => ipcRenderer.invoke('tts-speak', text, rate),
  cancel: () => ipcRenderer.invoke('tts-cancel'),
  speakHybrid: (payload) => ipcRenderer.invoke('tts-speak-hybrid', payload),
  prefetchHybrid: (payload) => ipcRenderer.invoke('tts-prefetch-hybrid', payload),
  probeEdge: () => ipcRenderer.invoke('tts-probe-edge'),
  resolveAssetUrl: (assetPath) => ipcRenderer.invoke('tts-resolve-asset-url', assetPath),
  getCacheStats: () => ipcRenderer.invoke('tts-cache-stats'),
  clearCache: () => ipcRenderer.invoke('tts-cache-clear'),
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
