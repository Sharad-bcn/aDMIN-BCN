import s from './styles.module.scss'
import { Link } from 'react-router-dom'

const Tabs = [
  {
    tabName: 'Features'
  },
  {
    tabName: 'Demographics'
  }
]

export default function Main() {
  const activeTab = window.location.pathname.includes('/features') ? Tabs[0].tabName : Tabs[1].tabName

  return (
    <div className={s.main}>
      <div className={s.dashboard}>
        <div className={s.dashboardActions}>
          {Tabs.map((tab, i) => (
            <Link
              className={tab.tabName === activeTab ? s.tab + ' ' + s.active : s.tab}
              key={i}
              to={tab.tabName === 'Features' ? '/admin/dashboard/features' : '/admin/dashboard/demographics'}
            >
              {tab.tabName}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
