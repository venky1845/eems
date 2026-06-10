import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Login          from './pages/auth/LoginPage'
import Signup         from './pages/auth/SignupPage'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword  from './pages/auth/ResetPassword'
import MembersPage    from './pages/members/MembersPage'

function GuestRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? <Navigate to="/members" replace /> : children
}

function PrivateRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"            element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup"           element={<GuestRoute><Signup /></GuestRoute>} />
          <Route path="/forgot-password"  element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/reset-password"   element={<GuestRoute><ResetPassword /></GuestRoute>} />
          <Route path="/members"          element={<PrivateRoute><MembersPage /></PrivateRoute>} />
          <Route path="*"                 element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}