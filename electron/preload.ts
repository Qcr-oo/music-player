import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openMusicFiles: () => ipcRenderer.invoke('open-music-files'),
  searchMusic: (keyword: string) => ipcRenderer.invoke('search-music', keyword),
  getSongUrl: (id: string) => ipcRenderer.invoke('get-song-url', id),
  getLyrics: (id: string) => ipcRenderer.invoke('get-lyrics', id),
})
