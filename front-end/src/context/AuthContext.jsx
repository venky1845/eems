import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Persisted to sessionStorage so a page refresh keeps the session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('eems_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const login = (user) => {
    setCurrentUser(user)
    sessionStorage.setItem('eems_user', JSON.stringify(user))
  }

  const logout = () => {
    setCurrentUser(null)
    sessionStorage.removeItem('eems_user')
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)