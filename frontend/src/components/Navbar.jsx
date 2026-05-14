import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?')
    if (!confirmed) return
    localStorage.removeItem('role')
    localStorage.removeItem('uid')
    navigate('/')
  }

  return (
    <nav style={{ background: '#1a237e', padding: '12px 24px',
                  display: 'flex', alignItems: 'center', gap: '20px' }}>
      <span style={{ color: 'white', fontWeight: 'bold',
                     marginRight: '30px' }}>📚 Library MS</span>

      {/* Librarian only links */}
      {role === 'librarian' && (
        <>
          <Link to="/books" style={{ color: 'white' }}>Books</Link>
          <Link to="/members" style={{ color: 'white' }}>Members</Link>
          <Link to="/issue" style={{ color: 'white' }}>Issue/Return</Link>
        </>
      )}

      {/* Both user and librarian */}
      {(role === 'user' || role === 'librarian') && (
        <Link to="/reports" style={{ color: 'white' }}>Reports</Link>
      )}
      {/* Only user */}
      {role === 'user' && (
        <>
         <Link to="/mybooks" style={{ color: 'white' }}>📚 My Books</Link>
         <Link to="/search" style={{ color: 'white' }}>🔍 Search Books</Link>
         </>
      )}

      {/* Logout button — only show when logged in */}
      {role && (
        <button onClick={handleLogout}
          style={{ marginLeft: 'auto', padding: '6px 14px',
                   background: 'crimson', color: 'white',
                   border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          🚪 Logout
        </button>
      )}
    </nav>
  )
}