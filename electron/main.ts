import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import * as https from 'https'
import * as querystring from 'querystring'
import match from '@unblockneteasemusic/server'

let mainWindow: BrowserWindow | null = null

// UnblockNeteaseMusic 兜底音源：国内可用、无需 cookie 的免费平台
const UNBLOCK_SOURCES = ['kuwo', 'kugou', 'bodian', 'migu']

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Music Player',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => { mainWindow = null })
}

function httpGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com/' } }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

function httpPost(url: string, body: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://music.163.com/',
        'Content-Length': Buffer.byteLength(body),
      },
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')) })
    req.write(body)
    req.end()
  })
}

// Search songs
ipcMain.handle('search-music', async (_e, keyword: string) => {
  try {
    const body = querystring.stringify({ s: keyword, type: '1', limit: '30', offset: '0' })
    const raw = await httpPost('https://music.163.com/api/search/get/web', body)
    const json = JSON.parse(raw)
    if (json.code !== 200 || !json.result?.songs) return []
    return json.result.songs.map((s: any) => ({
      id: String(s.id),
      title: s.name,
      artist: s.artists?.map((a: any) => a.name).join(' / ') || '未知',
      album: s.album?.name || '',
      duration: s.duration ? Math.round(s.duration / 1000) : 0,
      cover: s.album?.picUrl || '',
    }))
  } catch {
    return []
  }
})

// Get song play URL（三级兜底：网易云直连 → 多平台匹配 → 外链）
ipcMain.handle('get-song-url', async (_e, id: string) => {
  // 1. 网易云直连（免费歌曲直接命中）
  try {
    const raw = await httpGet(`https://music.163.com/api/song/enhance/player/url?ids=[${id}]&br=320000`)
    const json = JSON.parse(raw)
    if (json.code === 200 && json.data?.[0]?.url) {
      return json.data[0].url
    }
  } catch {
    // 落入下一级兜底
  }

  // 2. UnblockNeteaseMusic：从酷我/酷狗/波点/咪咕匹配可用链接（解锁 VIP/付费歌）
  try {
    const audio = await match(id, UNBLOCK_SOURCES)
    if (audio?.url) {
      return audio.url
    }
  } catch {
    // 落入下一级兜底
  }

  // 3. 外链兜底（部分免费歌仍可用）
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
})

// Get lyrics
ipcMain.handle('get-lyrics', async (_e, id: string) => {
  try {
    const raw = await httpGet(`https://music.163.com/api/song/lyric?id=${id}&lv=1&tv=-1`)
    const json = JSON.parse(raw)
    if (json.code === 200 && json.lrc?.lyric) {
      return json.lrc.lyric
    }
    return ''
  } catch {
    return ''
  }
})

// Local file dialogs
ipcMain.handle('open-music-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: '音乐文件', extensions: ['mp3', 'flac', 'wav', 'ogg', 'm4a', 'aac', 'wma'] }],
  })
  return result.filePaths
})

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (!mainWindow) createWindow() })
