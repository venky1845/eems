import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { currentUser } = useAuth()

  const initials = currentUser?.full_name
    ? currentUser.full_name.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <nav className="navbar">
      {/* Brand */}
      <a className="navbar-brand" href="#">
        <div className="navbar-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <div className="navbar-title">EEMS</div>
          <div className="navbar-sub">Enterprise Employee Management</div>
        </div>
      </a>

      <div className="navbar-tabs">
        <span className="navbar-tab active">Overview</span>
        <span className="navbar-tab">Company A</span>
      </div>

      {/* Right side */}
      <div className="navbar-right">
        <div className="navbar-avatar">{initials}</div>
        <span className="navbar-user-name">
          {currentUser?.full_name ?? 'Guest'}
        </span>
      </div>
    </nav>
  )
}