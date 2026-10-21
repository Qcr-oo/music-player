import { usePlayer } from '../hooks/usePlayer'
import { PlayMode } from '../types'
import { IconPlay, IconPause, IconPrev, IconNext, IconVolume, IconMute, IconLyrics } from './Icons'

interface Props {
  player: ReturnType<typeof usePlayer>
  onOpenLyrics: () => void
}

function formatTime(s: number): string {
  if (!s || isNaN(s)) return '00:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

const modeIcons: Record<PlayMode, string> = { sequence: '🔁', random: '🔀', single: '🔂' }
const modeLabels: Record<PlayMode, string> = { sequence: '顺序播放', random: '随机播放', single: '单曲循环' }
const modeNext: Record<PlayMode, PlayMode> = { sequence: 'random', random: 'single', single: 'sequence' }

export default function PlayerBar({ player, onOpenLyrics }: Props) {
  const {
    currentTrack, isPlaying, progress, duration, volume, playMode, playError,
    togglePlay, handleNext, handlePrev, seekStart, seekInput, seekEnd,
    setVolume, setPlayMode,
  } = player

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0
  const volumePct = volume * 100

  const filled = (pct: number) => ({
    background: `linear-gradient(to right, var(--green-500) ${pct}%, var(--border) ${pct}%)`,
  })

  return (
    <footer className="player-bar">
      {playError && <div className="play-error-toast">{playError}</div>}

      <div className="player-info">
        <div className="player-cover" onClick={onOpenLyrics} style={{ cursor: 'pointer' }} title="查看歌词">
          {currentTrack?.cover ? (
            <img src={currentTrack.cover} alt="cover" />
          ) : (
            <span className="cover-placeholder">🎵</span>
          )}
        </div>
        <div className="player-meta">
          <span className="player-title">{currentTrack?.title || '未在播放'}</span>
          <span className="player-artist">{currentTrack?.artist || '—'}</span>
        </div>
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button
            className={`ctrl-btn mode ${playMode !== 'sequence' ? 'active-mode' : ''}`}
            onClick={() => setPlayMode(modeNext[playMode])}
            title={modeLabels[playMode]}
          >
            {modeIcons[playMode]}
          </button>
          <button className="ctrl-btn" onClick={handlePrev} title="上一首"><IconPrev /></button>
          <button className="ctrl-btn play" onClick={togglePlay} title={isPlaying ? '暂停' : '播放'}>
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button className="ctrl-btn" onClick={handleNext} title="下一首"><IconNext /></button>
          <button className="ctrl-btn mode" onClick={onOpenLyrics} title="歌词"><IconLyrics /></button>
        </div>
        <div className="progress-row">
          <span className="time">{formatTime(progress)}</span>
          <input
            type="range"
            className="progress-slider"
            min={0}
            max={duration || 0}
            step={0.1}
            value={progress}
            style={filled(progressPct)}
            onPointerDown={seekStart}
            onChange={e => seekInput(Number(e.target.value))}
            onPointerUp={e => seekEnd(Number((e.target as HTMLInputElement).value))}
            onKeyUp={e => seekEnd(Number((e.target as HTMLInputElement).value))}
          />
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <span
          className="vol-icon"
          onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
          title={volume === 0 ? '取消静音' : '静音'}
        >
          {volume === 0 ? <IconMute /> : <IconVolume />}
        </span>
        <input
          type="range"
          className="volume-slider"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          style={filled(volumePct)}
          onChange={e => setVolume(Number(e.target.value))}
        />
      </div>
    </footer>
  )
}
