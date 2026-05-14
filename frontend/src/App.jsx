import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Books from './pages/Books'
import Members from './pages/Members'
import IssueReturn from './pages/IssueReturn'
import Reports from './pages/Reports'
import MyBooks from './pages/MyBooks'
import SearchBooks from './pages/SearchBooks'

function LibrarianRoute({ children }) {
  const role = localStorage.getItem('role')
  if (!role) return <Navigate to="/" />
  if (role !== 'librarian') return <Navigate to="/reports" />
  return children
}

function ProtectedRoute({ children }) {
  const role = localStorage.getItem('role')
  if (!role) return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Librarian only */}
          <Route path="/books" element={
            <LibrarianRoute><Books /></LibrarianRoute>
          }/>
          <Route path="/members" element={
            <LibrarianRoute><Members /></LibrarianRoute>
          }/>
          <Route path="/issue" element={
            <LibrarianRoute><IssueReturn /></LibrarianRoute>
          }/>

          {/* Both user and librarian */}
          <Route path="/reports" element={
            <ProtectedRoute><Reports /></ProtectedRoute>
          }/>
          <Route path="/mybooks" element={
            <ProtectedRoute><MyBooks /></ProtectedRoute>
          }/>

          {/* ✅ Only ONE /search route pointing to SearchBooks */}
          <Route path="/search" element={
            <ProtectedRoute><SearchBooks /></ProtectedRoute>
          }/>

        </Routes>
      </div>
    </BrowserRouter>
  )
}