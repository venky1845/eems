import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const initials = currentUser?.full_name
    ? currentUser.full_name.slice(0, 2).toUpperCase()
    : 'U'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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

      {/* Right side — profile + dropdown */}
      <div className="navbar-right" ref={dropdownRef}>
        <div
          className="navbar-profile-btn"
          onClick={() => setDropdownOpen((o) => !o)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setDropdownOpen((o) => !o)}
        >
          <div className="navbar-avatar">{initials}</div>
          <span className="navbar-user-name">
            {currentUser?.full_name ?? 'Guest'}
          </span>
          <svg
            className={`navbar-chevron${dropdownOpen ? ' open' : ''}`}
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {dropdownOpen && (
          <div className="navbar-dropdown">
            <div className="navbar-dropdown-header">
              <div className="navbar-dropdown-avatar">{initials}</div>
              <div>
                <div className="navbar-dropdown-name">{currentUser?.full_name}</div>
                <div className="navbar-dropdown-email">{currentUser?.email}</div>
                <span className="role-chip" style={{ marginTop: '4px', display: 'inline-block' }}>
                  {currentUser?.role}
                </span>
              </div>
            </div>
            <div className="navbar-dropdown-divider" />
            <button className="navbar-dropdown-logout" onClick={handleLogout}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}