import { useState, useRef, useCallback, useEffect } from 'react'
import { Track, PlayMode } from '../types'

export function usePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playlist, setPlaylist] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [playMode, setPlayMode] = useState<PlayMode>('sequence')
  const [playError, setPlayError] = useState('')

  // 拖拽进度时暂停 timeupdate 的覆盖，避免抖动
  const isSeekingRef = useRef(false)

  const currentTrack = currentIndex >= 0 ? playlist[currentIndex] : null

  // 用 ref 持有最新的 handleNext，避免 ended 监听器捕获初始闭包
  const handleNextRef = useRef<() => void>(() => {})

  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume
    audioRef.current = audio

    audio.addEventListener('timeupdate', () => {
      if (!isSeekingRef.current) setProgress(audio.currentTime)
    })
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))
    audio.addEventListener('ended', () => handleNextRef.current())
    audio.addEventListener('error', () => {
      if (!audio.src) return
      setIsPlaying(false)
      setPlayError('播放失败：该歌曲可能无音源（VIP/付费）或链接已失效')
    })

    return () => { audio.pause(); audio.src = '' }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const playTrack = useCallback((index: number) => {
    const audio = audioRef.current
    if (!audio || index < 0 || index >= playlist.length) return
    setCurrentIndex(index)
    setPlayError('')
    setProgress(0)
    setDuration(playlist[index].duration || 0)
    audio.src = playlist[index].src
    audio.play().catch(() => setIsPlaying(false))
    setIsPlaying(true)
  }, [playlist])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    if (isPlaying) { audio.pause(); setIsPlaying(false) }
    else { audio.play().catch(() => {}); setIsPlaying(true) }
  }, [isPlaying, currentTrack])

  const handleNext = useCallback(() => {
    if (playlist.length === 0) return
    let next: number
    if (playMode === 'single') {
      next = currentIndex
    } else if (playMode === 'random') {
      next = Math.floor(Math.random() * playlist.length)
    } else {
      next = (currentIndex + 1) % playlist.length
    }
    playTrack(next)
  }, [playlist, currentIndex, playMode, playTrack])

  // 每次渲染同步最新的 handleNext 到 ref
  useEffect(() => {
    handleNextRef.current = handleNext
  }, [handleNext])

  const handlePrev = useCallback(() => {
    if (playlist.length === 0) return
    const prev = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1
    playTrack(prev)
  }, [playlist, currentIndex, playTrack])

  // 直接定位（歌词点击 / 快捷键用）
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setProgress(time)
    }
  }, [])

  // 进度条拖拽三段式：开始 -> 滑动(仅更新显示) -> 结束(真正定位)
  const seekStart = useCallback(() => {
    isSeekingRef.current = true
  }, [])

  const seekInput = useCallback((time: number) => {
    setProgress(time)
    // 键盘操作（无 pointerdown）时直接定位
    if (!isSeekingRef.current && audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  const seekEnd = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time
    setProgress(time)
    isSeekingRef.current = false
  }, [])

  const addTracks = useCallback((tracks: Track[]) => {
    setPlaylist(prev => [...prev, ...tracks])
  }, [])

  // 添加并立即播放（原子操作，不依赖异步 state）
  const addAndPlay = useCallback((track: Track) => {
    const audio = audioRef.current
    if (!audio) return
    setPlayError('')
    setProgress(0)
    setDuration(track.duration || 0)
    setPlaylist(prev => {
      const newIndex = prev.length
      setCurrentIndex(newIndex)
      return [...prev, track]
    })
    audio.src = track.src
    audio.play().catch(() => setIsPlaying(false))
    setIsPlaying(true)
  }, [])

  const clearPlaylist = useCallback(() => {
    setPlaylist([])
    setCurrentIndex(-1)
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
  }, [])

  const removeTrack = useCallback((index: number) => {
    setPlaylist(prev => prev.filter((_, i) => i !== index))
    if (index === currentIndex) {
      setIsPlaying(false)
      if (audioRef.current) audioRef.current.pause()
    } else if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  return {
    playlist, currentTrack, currentIndex, isPlaying,
    progress, duration, volume, playMode, playError,
    playTrack, togglePlay, handleNext, handlePrev,
    seek, seekStart, seekInput, seekEnd,
    setVolume, setPlayMode, addTracks, addAndPlay, clearPlaylist, removeTrack,
  }
}
