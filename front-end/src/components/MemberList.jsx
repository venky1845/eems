import { useEffect, useState } from 'react'
import { getUsers, deactivateUser } from '../api/userApi'
import { useAuth } from '../context/AuthContext'

export default function MemberList() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'

  const [members, setMembers]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [busy, setBusy]         = useState(null) // id of member being deactivated

  useEffect(() => {
    getUsers()
      .then(setMembers)
      .catch(() => setError('Failed to load members.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDeactivate = async (id) => {
    setBusy(id)
    try {
      const updated = await deactivateUser(id)
      setMembers(prev => prev.map(m => m.id === updated.id ? updated : m))
    } catch {
      alert('Failed to deactivate. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  if (loading) return <div className="loading-state">Loading members…</div>
  if (error)   return <div className="error-msg" style={{ margin: '24px' }}>{error}</div>

  return (
    <div className="members-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 5 : 4}>
                <div className="empty-state">No members added yet.</div>
              </td>
            </tr>
          ) : (
            members.map(m => (
              <tr key={m.id}>
                <td>{m.full_name}</td>
                <td>{m.email}</td>
                <td><span className="role-chip">{m.role}</span></td>
                <td>
                  <span className={m.status === 'Active' ? 'badge-active' : 'badge-inactive'}>
                    {m.status}
                  </span>
                </td>
                {isAdmin && (
                  <td>
                    <button
                      className="btn-deactivate"
                      disabled={m.status === 'Inactive' || busy === m.id}
                      onClick={() => handleDeactivate(m.id)}
                    >
                      {busy === m.id ? 'Deactivating…' : 'Deactivate'}
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}