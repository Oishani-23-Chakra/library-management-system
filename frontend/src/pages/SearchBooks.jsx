import { useState } from 'react'
import axios from 'axios'

const API = 'http://127.0.0.1:5000/api'

export default function SearchBooks() {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) {
      alert('Please enter something to search!')
      return
    }
    setLoading(true)
    try {
      const res = await axios.get(`${API}/search?q=${query}`)
      setBooks(res.data)
      setSearched(true)
    } catch (err) {
      alert('Server error!')
    } finally {
      setLoading(false)
    }
  }

  const available = books.filter(b => b.status === 'Available').length
  const issued = books.filter(b => b.status === 'Issued').length

  return (
    <div style={{ padding: '20px' }}>
      <h2>🔍 Search Books</h2>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          placeholder="Search by name, author, type, accession no..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ padding: '10px', width: '400px',
                   border: '2px solid #1a237e', fontSize: '15px' }}
        />
        <button
          onClick={() => handleSearch()}
          style={{ padding: '10px 24px', background: '#1a237e',
                   color: 'white', border: 'none', cursor: 'pointer',
                   fontSize: '15px' }}>
          Search
        </button>
        {searched && (
          <button
            onClick={() => { setBooks([]); setQuery(''); setSearched(false) }}
            style={{ padding: '10px 16px', background: '#ccc',
                     border: 'none', cursor: 'pointer' }}>
            Clear
          </button>
        )}
      </div>

      {loading && <p>Searching...</p>}

      {/* Summary */}
      {searched && !loading && books.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ padding: '10px 20px', background: '#e8f5e9',
                        borderRadius: '6px', fontWeight: 'bold' }}>
            ✅ Available: {available}
          </div>
          <div style={{ padding: '10px 20px', background: '#ffebee',
                        borderRadius: '6px', fontWeight: 'bold' }}>
            📖 Issued: {issued}
          </div>
          <div style={{ padding: '10px 20px', background: '#e3f2fd',
                        borderRadius: '6px', fontWeight: 'bold' }}>
            📚 Total: {books.length}
          </div>
        </div>
      )}

      {/* No results */}
      {searched && !loading && books.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <p style={{ fontSize: '40px' }}>📭</p>
          <p>No books found for "<b>{query}</b>"</p>
        </div>
      )}

      {/* Table — only shows AFTER searching */}
      {searched && books.length > 0 && (
        <table border="1" cellPadding="10"
               style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a237e', color: 'white' }}>
            <tr>
              <th>Accession No</th>
              <th>Book Name</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>Type</th>
              <th>Language</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b, i) => (
              <tr key={i}
                  style={{ background: i % 2 === 0 ? '#fafafa' : 'white' }}>
                <td>{b.accession_no}</td>
                <td><b>{b.bookname}</b></td>
                <td>{b.author}</td>
                <td>{b.publisher || '—'}</td>
                <td>{b.type || '—'}</td>
                <td>{b.language || '—'}</td>
                <td>₹{b.price}</td>
                <td>
                  {b.status === 'Available' ? (
                    <span style={{
                      background: '#e8f5e9', color: 'green',
                      padding: '4px 12px', borderRadius: '12px',
                      fontWeight: 'bold', display: 'inline-block'
                    }}>
                      ✅ Available
                    </span>
                  ) : (
                    <span style={{
                      background: '#ffebee', color: 'crimson',
                      padding: '4px 12px', borderRadius: '12px',
                      fontWeight: 'bold', display: 'inline-block'
                    }}>
                      📖 Issued
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}