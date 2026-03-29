const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('nativeTTS', {
  speak: (text, rate) => ipcRenderer.invoke('tts-speak', text, rate),
  cancel: () => ipcRenderer.invoke('tts-cancel'),
})

contextBridge.exposeInMainWorld('electronAPI', {
  // Methods for app level IPC can go here
  isElectron: true
})
