import { Link } from 'react-router-dom'
import s from './styles.module.scss'
import images from 'images'

export default function Main({ fullscreen, setFullscreen }) {
  return (
    <>
      <div id='nav' className={s.outernav}>
        <nav className={s.nav}>
          <div className={s.left}>
            <Link to='/home'>
              <img src={images.logoWhite} alt='' />
            </Link>
          </div>

          <div className={s.right}>
            <NavLinks />
          </div>
        </nav>
      </div>

      {!!fullscreen && (
        <div className={s.fullscreenMenu} onClick={() => setFullscreen(false)}>
          <div className={s.close + ' material-icons'}>close</div>
          <NavLinks />
        </div>
      )}

      <div className={s.hamburger + ' material-icons'} onClick={() => setFullscreen(true)}>
        menu
      </div>
    </>
  )
}

const NavLinks = () => {
  const adminData = JSON.parse(window.localStorage.getItem('adminData'))
  var navLinks = []

  if (adminData && adminData.access === 'superAdmin') navLinks = superAdminNavLinks
  else navLinks = adminNavLinks

  return (
    <div className={s.navLinks}>
      {navLinks.map(({ name, path, icon }, i) => (
        <Link key={i} to={path} className={window.location.pathname.startsWith(path) ? s.active : ''} title={name}>
          <span className='material-icons-outlined'>{icon}</span>
          <div className={s.fieldName}>{name}</div>
        </Link>
      ))}
    </div>
  )
}

const adminNavLinks = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard/features',
    icon: 'dashboard'
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: 'people'
  },
  {
    name: 'Approval Requests',
    path: '/admin/approvalRequests',
    icon: 'event_available'
  },
  {
    name: 'Edit Profile',
    path: '/admin/editProfile',
    icon: 'edit'
  },
  {
    name: 'Sign Out',
    path: '/signOut',
    icon: 'logout'
  }
]

const superAdminNavLinks = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard/features',
    icon: 'dashboard'
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: 'people'
  },
  {
    name: 'Approval Requests',
    path: '/admin/approvalRequests',
    icon: 'event_available'
  },
  {
    name: 'Admins',
    path: '/admin/admins',
    icon: 'admin_panel_settings'
  },
  {
    name: 'Edit Profile',
    path: '/admin/editProfile',
    icon: 'edit'
  },
  {
    name: 'Sign Out',
    path: '/signOut',
    icon: 'logout'
  }
]
