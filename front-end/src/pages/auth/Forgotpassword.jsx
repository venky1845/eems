import { useState } from 'react'
import { forgotPassword } from '../../api/userApi'

export default function ForgotPassword() {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Please enter your email address.')

    try {
      setLoading(true)
      await forgotPassword({ email })
      setSubmitted(true)
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h1>Forgot Password</h1>
        <p className="subtitle">
          {submitted
            ? 'Check your inbox for a reset link.'
            : "Enter your email and we'll send you a reset link."}
        </p>

        {!submitted ? (
          <>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="success-msg">
            A password reset link has been sent to <strong>{email}</strong>.
            If you don't see it, check your spam folder.
          </div>
        )}

        <p className="auth-footer">
          Remembered it? <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  )
}