interface IconProps {
  size?: number
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export const IconLogo = ({ size = 20 }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.2}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)

export const IconSearch = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export const IconFolder = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
  </svg>
)

export const IconList = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <path d="M3 6h.01M3 12h.01M3 18h.01" strokeWidth={2.6} />
  </svg>
)

export const IconLyrics = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 13h6M9 17h4" />
  </svg>
)

export const IconPlus = ({ size = 15 }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.4}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconPlay = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.54-6.86a1.05 1.05 0 0 0 0-1.76L9.56 4.26A1.05 1.05 0 0 0 8 5.14Z" />
  </svg>
)

export const IconPause = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4.5" height="16" rx="1.5" />
    <rect x="13.5" y="4" width="4.5" height="16" rx="1.5" />
  </svg>
)

export const IconPrev = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 5a1 1 0 0 1 2 0v14a1 1 0 1 1-2 0V5Z" />
    <path d="M20 6.5v11a1 1 0 0 1-1.53.85l-8.8-5.5a1 1 0 0 1 0-1.7l8.8-5.5A1 1 0 0 1 20 6.5Z" />
  </svg>
)

export const IconNext = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 5a1 1 0 0 0-2 0v14a1 1 0 1 0 2 0V5Z" />
    <path d="M4 6.5v11a1 1 0 0 0 1.53.85l8.8-5.5a1 1 0 0 0 0-1.7l-8.8-5.5A1 1 0 0 0 4 6.5Z" />
  </svg>
)

export const IconVolume = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" stroke="none" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.4 5.6a9 9 0 0 1 0 12.8" />
  </svg>
)

export const IconMute = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" stroke="none" />
    <path d="m16 9 6 6M22 9l-6 6" />
  </svg>
)

export const IconMusic = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)
