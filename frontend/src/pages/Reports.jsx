import { useState } from 'react'
import axios from 'axios'

const API = 'http://127.0.0.1:5000/api'
const genres = ['Detective','Fantasy','Sci-fi','Self help',
                 'Mystery','Comics','Novel']

export default function Reports() {
  const [books, setBooks] = useState([])
  const [issued, setIssued] = useState([])

  const fetchGenre = async (genre) => {
    const res = await axios.get(`${API}/reports/genre/${genre}`)
    setBooks(res.data)
    setIssued([])
  }

  const fetchIssued = async () => {
    const res = await axios.get(`${API}/reports/issued`)
    setIssued(res.data)
    setBooks([])
  }

  return (
    <div>
      <h2>📊 Reports</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap',
                    marginBottom: '20px' }}>
        <button onClick={fetchIssued}
          style={{ padding: '8px 16px', background: '#1a237e',
                   color: 'white', border: 'none', cursor: 'pointer' }}>
          📋 Issued Books
        </button>
        {genres.map(g => (
          <button key={g} onClick={() => fetchGenre(g)}
            style={{ padding: '8px 16px', background: '#424242',
                     color: 'white', border: 'none', cursor: 'pointer' }}>
            {g}
          </button>
        ))}
      </div>

      {/* Genre Results */}
      {books.length > 0 && (
        <table border="1" cellPadding="8"
               style={{ borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a237e', color: 'white' }}>
            <tr><th>Book No</th><th>Book Name</th></tr>
          </thead>
          <tbody>
            {books.map((b, i) => (
              <tr key={i}><td>{b.book_no}</td><td>{b.bookname}</td></tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Issued Books */}
      {issued.length > 0 && (
        <table border="1" cellPadding="8"
               style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead style={{ background: '#1a237e', color: 'white' }}>
            <tr>
              <th>Accession No</th><th>Book Name</th><th>Author</th>
              <th>Member</th><th>Issue Date</th>
            </tr>
          </thead>
          <tbody>
            {issued.map((b, i) => (
              <tr key={i}>
                <td>{b.accession_no}</td><td>{b.bookname}</td>
                <td>{b.author}</td><td>{b.member_name}</td>
                <td>{b.issue_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}