import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../../api/userApi'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [form, setForm]     = useState({ password: '', confirm_password: '' })
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.password || !form.confirm_password)
      return setError('Both fields are required.')
    if (form.password !== form.confirm_password)
      return setError('Passwords do not match.')
    if (form.password.length < 8)
      return setError('Password must be at least 8 characters.')

    try {
      setLoading(true)
      await resetPassword({ token, password: form.password })
      navigate('/login')
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Reset link is invalid or has expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-icon" style={{ background: '#dc2626' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1>Invalid Link</h1>
          <p className="subtitle">This reset link is missing or invalid.</p>
          <p className="auth-footer"><a href="/forgot-password">Request a new link</a></p>
        </div>
      </div>
    )
  }

  const EyeOff = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )

  const EyeOn = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )

  const LockIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        <h1>Reset Password</h1>
        <p className="subtitle">Choose a new password for your account.</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrap">
              <span className="input-icon"><LockIcon /></span>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Enter new password"
                value={form.password}
                onChange={set('password')}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPw(p => !p)}>
                {showPw ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrap">
              <span className="input-icon"><LockIcon /></span>
              <input
                type={showCpw ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={form.confirm_password}
                onChange={set('confirm_password')}
              />
              <button type="button" className="eye-btn" onClick={() => setShowCpw(p => !p)}>
                {showCpw ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>

        <p className="auth-footer">
          <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  )
}