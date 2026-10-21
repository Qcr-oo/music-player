export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  src: string
  cover?: string
  lyric?: string
  source?: 'local' | 'online'
}

export interface SearchResult {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
}

export type PlayMode = 'sequence' | 'random' | 'single'
export type ViewType = 'local' | 'search' | 'playlist' | 'lyrics'

declare global {
  interface Window {
    electronAPI: {
      openMusicFiles: () => Promise<string[]>
      searchMusic: (keyword: string) => Promise<SearchResult[]>
      getSongUrl: (id: string) => Promise<string>
      getLyrics: (id: string) => Promise<string>
    }
  }
}
