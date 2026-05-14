import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'http://127.0.0.1:5000/api'

export default function Login() {
  const [mode, setMode] = useState('signin')       // 'signin' or 'register'
  const [role, setRole] = useState('user')          // 'user' or 'librarian'
  const [uid, setUid] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [libPassword, setLibPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')

    // Librarian password check
    if (role === 'librarian' && libPassword !== 'lib@hvm') {
      setError('❌ Wrong librarian password!')
      return
    }

    try {
      if (mode === 'signin') {
        const res = await axios.post(`${API}/auth/signin`, { uid })
        if (res.data.success) {
          localStorage.setItem('role', role)
          localStorage.setItem('uid', uid)
          navigate(role === 'librarian' ? '/books' : '/reports')
        } else {
          setError('❌ User ID not found!')
        }

      } else {
        // Register / Login (new user)
        if (!name || !phone || !uid) {
          setError('❌ All fields are required!')
          return
        }
        if (phone.length !== 10) {
          setError('❌ Phone number must be 10 digits!')
          return
        }
        const res = await axios.post(`${API}/auth/register`, { name, phone, uid })
        if (res.data.success) {
          localStorage.setItem('role', role)
          localStorage.setItem('uid', uid)
          alert('✅ Account created successfully!')
          navigate(role === 'librarian' ? '/books' : '/reports')
        }
      }
    } catch {
      setError('❌ Server error! Make sure Flask is running.')
    }
  }

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto',
                  fontFamily: 'Arial', textAlign: 'center' }}>

      <h2>📚 School Library Management System</h2>

      {/* Role selector */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ marginRight: '16px' }}>
          <input type="radio" value="user"
            checked={role === 'user'}
            onChange={() => setRole('user')} /> User
        </label>
        <label>
          <input type="radio" value="librarian"
            checked={role === 'librarian'}
            onChange={() => setRole('librarian')} /> Librarian
        </label>
      </div>

      {/* Mode selector */}
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setMode('signin')}
          style={{ marginRight: '8px', padding: '6px 16px',
                   background: mode === 'signin' ? '#1a237e' : '#ccc',
                   color: mode === 'signin' ? 'white' : 'black',
                   border: 'none', cursor: 'pointer' }}>
          Sign In
        </button>
        <button onClick={() => setMode('register')}
          style={{ padding: '6px 16px',
                   background: mode === 'register' ? '#1a237e' : '#ccc',
                   color: mode === 'register' ? 'white' : 'black',
                   border: 'none', cursor: 'pointer' }}>
          New User? Register
        </button>
      </div>

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Librarian password */}
        {role === 'librarian' && (
          <input type="password" placeholder="Enter Librarian Password"
            value={libPassword}
            onChange={e => setLibPassword(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ccc' }} />
        )}

        {/* Register extra fields */}
        {mode === 'register' && (
          <>
            <input placeholder="Full Name"
              value={name} onChange={e => setName(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ccc' }} />
            <input placeholder="Phone Number (10 digits)"
              value={phone} onChange={e => setPhone(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ccc' }} />
          </>
        )}

        <input placeholder="Enter User ID"
          value={uid} onChange={e => setUid(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ccc' }} />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button onClick={handleSubmit}
          style={{ padding: '10px', background: '#1a237e',
                   color: 'white', border: 'none', cursor: 'pointer',
                   fontSize: '16px' }}>
          {mode === 'signin' ? '🔐 Sign In' : '📝 Register'}
        </button>
      </div>
    </div>
  )
}