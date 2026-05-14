import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://127.0.0.1:5000/api'

export default function MyBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const uid = localStorage.getItem('uid')

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const res = await axios.get(`${API}/mybooks/${uid}`)
        setBooks(res.data)
      } catch {
        alert('❌ Could not fetch your books!')
      } finally {
        setLoading(false)
      }
    }
    fetchMyBooks()
  }, [])

  return (
    <div>
      <h2>📚 My Issued Books</h2>
      <p style={{ color: '#555' }}>Logged in as: <b>{uid}</b></p>

      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px',
                      color: '#888' }}>
          <p style={{ fontSize: '48px' }}>📭</p>
          <p>No books issued to you yet.</p>
        </div>
      ) : (
        <table border="1" cellPadding="10"
               style={{ width: '100%', borderCollapse: 'collapse',
                        marginTop: '16px' }}>
          <thead style={{ background: '#1a237e', color: 'white' }}>
            <tr>
              <th>Accession No</th>
              <th>Book Name</th>
              <th>Author</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Fine (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b, i) => {
              const isReturned = b.return_date !== 'Not returned yet'
              const isOverdue = !isReturned &&
                                new Date(b.due_date) < new Date()
              return (
                <tr key={i} style={{
                  background: isReturned ? '#e8f5e9'
                            : isOverdue  ? '#ffebee'
                            : 'white'
                }}>
                  <td>{b.accession_no}</td>
                  <td><b>{b.bookname}</b></td>
                  <td>{b.author}</td>
                  <td>{b.issue_date}</td>
                  <td>{b.due_date}</td>
                  <td>{b.return_date}</td>
                  <td style={{ color: b.fine > 0 ? 'red' : 'green',
                               fontWeight: 'bold' }}>
                    ₹{b.fine}
                  </td>
                  <td>
                    {isReturned ? (
                      <span style={{ color: 'green',
                                     fontWeight: 'bold' }}>
                        ✅ Returned
                      </span>
                    ) : isOverdue ? (
                      <span style={{ color: 'red',
                                     fontWeight: 'bold' }}>
                        ⚠️ Overdue
                      </span>
                    ) : (
                      <span style={{ color: '#f57c00',
                                     fontWeight: 'bold' }}>
                        📖 Issued
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}