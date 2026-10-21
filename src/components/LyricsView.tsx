import { useMemo, useRef, useEffect } from 'react'
import { usePlayer } from '../hooks/usePlayer'

interface Props {
  player: ReturnType<typeof usePlayer>
}

interface LyricLine {
  time: number
  text: string
}

function parseLyric(raw: string): LyricLine[] {
  if (!raw) return []
  const lines: LyricLine[] = []
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g
  for (const line of raw.split('\n')) {
    const matches = [...line.matchAll(regex)]
    const text = line.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '').trim()
    for (const m of matches) {
      const time = parseInt(m[1]) * 60 + parseInt(m[2]) + parseInt(m[3]) / (m[3].length === 3 ? 1000 : 100)
      lines.push({ time, text })
    }
  }
  return lines.sort((a, b) => a.time - b.time)
}

export default function LyricsView({ player }: Props) {
  const { currentTrack, progress, isPlaying, seek } = player
  const scrollRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([])

  const lyricLines = useMemo(() => {
    return parseLyric(currentTrack?.lyric || '')
  }, [currentTrack])

  const activeIndex = useMemo(() => {
    let idx = -1
    for (let i = 0; i < lyricLines.length; i++) {
      if (lyricLines[i].time <= progress) idx = i
      else break
    }
    return idx
  }, [lyricLines, progress])

  // 当前行变化时平滑滚动到视口中央
  useEffect(() => {
    const container = scrollRef.current
    const line = lineRefs.current[activeIndex]
    if (!container || !line) return
    const target = line.offsetTop - container.clientHeight / 2 + line.clientHeight / 2
    container.scrollTo({ top: target, behavior: 'smooth' })
  }, [activeIndex])

  if (!currentTrack) {
    return (
      <div className="view">
        <div className="empty-state">
          <p className="empty-icon">📝</p>
          <p>暂无歌词</p>
          <p className="empty-hint">播放一首歌曲后查看歌词</p>
        </div>
      </div>
    )
  }

  return (
    <div className="view lyrics-page">
      {currentTrack.cover && (
        <div
          className="lyrics-backdrop"
          style={{ backgroundImage: `url(${currentTrack.cover})` }}
        />
      )}

      <div className="lyrics-stage">
        <div className="disc-side">
          <div className="disc-wrap">
            <div className={`disc ${isPlaying ? 'spinning' : ''}`}>
              <div className="disc-cover">
                {currentTrack.cover ? (
                  <img src={currentTrack.cover} alt="cover" />
                ) : (
                  <span className="cover-placeholder-lg">🎵</span>
                )}
              </div>
            </div>
          </div>
          <div className="disc-info">
            <h2>{currentTrack.title}</h2>
            <p>{currentTrack.artist}</p>
            {currentTrack.album && <p className="lyrics-album">{currentTrack.album}</p>}
          </div>
        </div>

        <div className="lyrics-scroll" ref={scrollRef}>
          {lyricLines.length === 0 ? (
            <div className="empty-state">
              <p>暂无歌词</p>
              <p className="empty-hint">该歌曲可能没有歌词，或为纯音乐</p>
            </div>
          ) : (
            lyricLines.map((line, idx) => (
              <p
                key={idx}
                ref={el => { lineRefs.current[idx] = el }}
                className={`lyric-line ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => seek(line.time)}
                title="点击跳转到这句歌词"
              >
                {line.text || '♪'}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
