import { useState } from 'react'
import { usePlayer } from '../hooks/usePlayer'
import { Track } from '../types'
import { IconPlus, IconPlay } from './Icons'

interface Props {
  player: ReturnType<typeof usePlayer>
}

function parseFileName(filePath: string): { title: string; artist: string } {
  const name = filePath.replace(/\\/g, '/').split('/').pop() || ''
  const base = name.replace(/\.[^.]+$/, '')
  const parts = base.split(' - ')
  if (parts.length >= 2) return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() }
  return { artist: '未知艺术家', title: base }
}

export default function LocalMusic({ player }: Props) {
  const [loading, setLoading] = useState(false)
  const { playlist, currentIndex, isPlaying } = player

  const handleAddFiles = async () => {
    if (!window.electronAPI) return
    setLoading(true)
    const files = await window.electronAPI.openMusicFiles()
    if (files.length > 0) {
      const tracks: Track[] = files.map((f, i) => {
        const { title, artist } = parseFileName(f)
        return {
          id: `local-${Date.now()}-${i}`,
          title,
          artist,
          album: '本地音乐',
          duration: 0,
          src: `file:///${f.replace(/\\/g, '/')}`,
        }
      })
      player.addTracks(tracks)
    }
    setLoading(false)
  }

  return (
    <div className="view">
      <div className="view-header">
        <h2><span className="h-emoji">📁</span>本地音乐</h2>
        <button className="btn-primary" onClick={handleAddFiles} disabled={loading}>
          <IconPlus />
          {loading ? '加载中...' : '添加音乐文件'}
        </button>
      </div>

      {playlist.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🎶</p>
          <p>还没有添加音乐</p>
          <p className="empty-hint">点击"添加音乐文件"选择本地 mp3 / flac / wav 等文件</p>
        </div>
      ) : (
        <div className="track-list">
          <div className="track-list-header">
            <span className="col-index">#</span>
            <span className="col-title">标题</span>
            <span className="col-artist">艺术家</span>
            <span className="col-action"></span>
          </div>
          {playlist.map((track, idx) => {
            const playing = idx === currentIndex
            return (
              <div
                key={track.id}
                className={`track-item ${playing ? 'playing' : ''}`}
                onDoubleClick={() => player.playTrack(idx)}
              >
                <span className="col-index">
                  {playing ? (
                    <span className={`eq ${isPlaying ? '' : 'paused'}`}>
                      <span /><span /><span />
                    </span>
                  ) : (
                    idx + 1
                  )}
                </span>
                <span className="col-title">{track.title}</span>
                <span className="col-artist">{track.artist}</span>
                <span className="col-action">
                  <button className="btn-icon" onClick={() => player.playTrack(idx)} title="播放">
                    <IconPlay size={14} />
                  </button>
                  <button className="btn-icon" onClick={() => player.removeTrack(idx)} title="移除">✕</button>
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
