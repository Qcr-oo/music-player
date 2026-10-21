import { useState, useEffect } from 'react'
import { ViewType } from './types'
import { usePlayer } from './hooks/usePlayer'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import LocalMusic from './components/LocalMusic'
import SearchView from './components/SearchView'
import PlaylistView from './components/PlaylistView'
import LyricsView from './components/LyricsView'

function App() {
  const [view, setView] = useState<ViewType>('search')
  const player = usePlayer()

  // 全局快捷键：空格 播放/暂停，← → 上一首/下一首
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return
      if (e.code === 'Space') {
        e.preventDefault()
        player.togglePlay()
      } else if (e.code === 'ArrowRight') {
        player.handleNext()
      } else if (e.code === 'ArrowLeft') {
        player.handlePrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [player.togglePlay, player.handleNext, player.handlePrev])

  return (
    <div className="app">
      <Sidebar view={view} onViewChange={setView} trackCount={player.playlist.length} />
      <main className="main">
        {view === 'local' && <LocalMusic player={player} />}
        {view === 'search' && <SearchView player={player} />}
        {view === 'playlist' && <PlaylistView player={player} />}
        {view === 'lyrics' && <LyricsView player={player} />}
      </main>
      <PlayerBar player={player} onOpenLyrics={() => setView('lyrics')} />
    </div>
  )
}

export default App
