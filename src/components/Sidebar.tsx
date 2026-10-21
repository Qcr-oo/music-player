import { ViewType } from '../types'
import { IconLogo, IconSearch, IconFolder, IconList, IconLyrics } from './Icons'

interface Props {
  view: ViewType
  onViewChange: (v: ViewType) => void
  trackCount: number
}

interface NavItem {
  key: ViewType
  label: string
  icon: React.ReactNode
}

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: '在线音乐',
    items: [{ key: 'search', label: '搜索', icon: <IconSearch /> }],
  },
  {
    title: '我的音乐',
    items: [
      { key: 'local', label: '本地音乐', icon: <IconFolder /> },
      { key: 'playlist', label: '播放列表', icon: <IconList /> },
    ],
  },
  {
    title: '正在播放',
    items: [{ key: 'lyrics', label: '歌词', icon: <IconLyrics /> }],
  },
]

export default function Sidebar({ view, onViewChange, trackCount }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <IconLogo />
        </div>
        <div className="logo-text">
          <span className="logo-name">Music Player</span>
          <span className="logo-sub">开源免费 · v1.0</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => (
          <div className="nav-section" key={section.title}>
            <span className="nav-section-title">{section.title}</span>
            {section.items.map(item => (
              <button
                key={item.key}
                className={`nav-item ${view === item.key ? 'active' : ''}`}
                onClick={() => onViewChange(item.key)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.key === 'playlist' && trackCount > 0 && (
                  <span className="nav-badge">{trackCount}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="version">v1.0.0 · 免费开源 · 网易云音源</span>
      </div>
    </aside>
  )
}
