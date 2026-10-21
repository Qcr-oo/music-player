declare module '@unblockneteasemusic/server' {
  interface AudioData {
    size: number
    br: number | null
    url: string | null
    md5: string | null
    source: string
  }
  function match(id: string, source?: string[], data?: unknown): Promise<AudioData>
  export default match
}
