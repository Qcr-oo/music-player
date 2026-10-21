import { useState } from 'react'
import { usePlayer } from '../hooks/usePlayer'
import { SearchResult, Track } from '../types'
import { IconSearch, IconPlay } from './Icons'

interface Props {
  player: ReturnType<typeof usePlayer>
}

export default function SearchView({ player }: Props) {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!keyword.trim() || !window.electronAPI) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await window.electronAPI.searchMusic(keyword.trim())
      setResults(res)
    } catch {
      setResults([])
    }
    setLoading(false)
  }

  const handlePlay = async (item: SearchResult) => {
    if (!window.electronAPI) return
    const url = await window.electronAPI.getSongUrl(item.id)
    if (!url) {
      alert('该歌曲暂无音源（可能是 VIP/付费歌曲）')
      return
    }
    const lyric = await window.electronAPI.getLyrics(item.id)
    const track: Track = {
      id: `online-${item.id}`,
      title: item.title,
      artist: item.artist,
      album: item.album,
      duration: item.duration,
      src: url,
      cover: item.cover,
      lyric,
      source: 'online',
    }
    player.addAndPlay(track)
  }

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="view">
      <div className="view-header">
        <h2>🔍 搜索</h2>
      </div>
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="搜索歌曲、歌手、专辑..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          autoFocus
        />
        <button className="btn-primary" onClick={handleSearch} disabled={loading}>
          <IconSearch size={15} />
          {loading ? '搜索中...' : '搜索'}
        </button>
      </div>

      {loading && (
        <div className="empty-state"><p>⏳ 正在搜索...</p></div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="empty-state">
          <p className="empty-icon">😔</p>
          <p>没有找到相关结果</p>
          <p className="empty-hint">换个关键词试试</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="track-list">
          <div className="track-list-header search-header">
            <span className="col-index">#</span>
            <span className="col-title">歌曲</span>
            <span className="col-artist">歌手</span>
            <span className="col-album">专辑</span>
            <span className="col-duration">时长</span>
            <span className="col-action"></span>
          </div>
          {results.map((item, idx) => (
            <div key={item.id} className="track-item search-item" onDoubleClick={() => handlePlay(item)}>
              <span className="col-index">{idx + 1}</span>
              <span className="col-title">{item.title}</span>
              <span className="col-artist">{item.artist}</span>
              <span className="col-album">{item.album}</span>
              <span className="col-duration">{formatDuration(item.duration)}</span>
              <span className="col-action">
                <button className="btn-icon" onClick={() => handlePlay(item)} title="播放">
                  <IconPlay size={14} />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {!searched && (
        <div className="empty-state">
          <p className="empty-icon">🎧</p>
          <p>搜索你想听的歌曲</p>
          <p className="empty-hint">
            <span className="source-tag"><span className="dot" />音源：网易云音乐</span>
            {' '}· 双击搜索结果直接播放
          </p>
        </div>
      )}
    </div>
  )
}
