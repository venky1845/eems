import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import SignupPage  from './pages/SignupPage'
import LoginPage   from './pages/LoginPage'
import MembersPage from './pages/MembersPage'

/** Redirect already-logged-in users away from auth pages */
function GuestRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? <Navigate to="/members" replace /> : children
}

/** Require login — redirect to /login if not authenticated */
function PrivateRoute({ children, requiredRole }) {
  const { currentUser } = useAuth()

  if (!currentUser) return <Navigate to="/login" replace />

  // Role-based: if a specific role is required, check it
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/members" replace />
  }

  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth pages — skip if already logged in */}
          <Route path="/signup" element={
            <GuestRoute><SignupPage /></GuestRoute>
          } />
          <Route path="/login" element={
            <GuestRoute><LoginPage /></GuestRoute>
          } />

          {/* Protected pages */}
          <Route path="/members" element={
            <PrivateRoute><MembersPage /></PrivateRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}