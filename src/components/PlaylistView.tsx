import { usePlayer } from '../hooks/usePlayer'
import { IconPlay } from './Icons'

interface Props {
  player: ReturnType<typeof usePlayer>
}

export default function PlaylistView({ player }: Props) {
  const { playlist, currentIndex, isPlaying } = player

  return (
    <div className="view">
      <div className="view-header">
        <h2><span className="h-emoji">📋</span>播放列表</h2>
        {playlist.length > 0 && (
          <button className="btn-danger" onClick={player.clearPlaylist}>清空列表</button>
        )}
      </div>

      {playlist.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <p>播放列表为空</p>
          <p className="empty-hint">去"搜索"或"本地音乐"添加歌曲吧</p>
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
