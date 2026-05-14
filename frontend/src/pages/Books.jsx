import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://127.0.0.1:5000/api'

export default function Books() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    accession_no:'', book_no:'', bookname:'', author:'',
    publisher:'', pubdate:'', source:'', rcv_date:'',
    volume:'', price:'', language:'', type:'', class:''
  })
  const [editBook, setEditBook] = useState(null)  // holds book being edited

  const role = localStorage.getItem('role')

  const fetchBooks = async () => {
    const res = await axios.get(`${API}/books`)
    setBooks(res.data)
  }

  useEffect(() => { fetchBooks() }, [])

  const addBook = async () => {
    if (!form.accession_no || !form.bookname || !form.author) {
      alert('❌ Accession No, Book Name and Author are required!')
      return
    }
    await axios.post(`${API}/books`, form)
    alert('✅ Book added successfully!')
    fetchBooks()
  }

  const deleteBook = async (ac, bookname) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete "${bookname}"?`
    )
    if (!confirmed) return
    await axios.delete(`${API}/books/${ac}`)
    alert('✅ Book deleted successfully!')
    fetchBooks()
  }

  // When edit button clicked, fill the edit form with that book's data
  const handleEditClick = (b) => {
    setEditBook({
      accession_no: b.accession_no,
      book_no: b.book_no,
      bookname: b.bookname,
      author: b.author,
      publisher: b.publisher || '',
      pubdate: b.pubdate || '',
      source: b.source || '',
      rcv_date: b.rcv_date || '',
      volume: b.volume || '',
      price: b.price || '',
      language: b.language || '',
      type: b.type || '',
      class: b.class || ''
    })
  }

  const saveEdit = async () => {
    if (!editBook.bookname || !editBook.author) {
      alert('❌ Book Name and Author are required!')
      return
    }
    await axios.put(`${API}/books/${editBook.accession_no}`, editBook)
    alert('✅ Book updated successfully!')
    setEditBook(null)
    fetchBooks()
  }

  const filtered = books.filter(b =>
    b.bookname?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase()) ||
    b.accession_no?.toLowerCase().includes(search.toLowerCase()) ||
    b.type?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>📖 {role === 'librarian' ? 'Book Management' : 'Search Books'}</h2>

      {/* Search bar */}
      <input
        placeholder="🔍 Search by name, author, type, accession no..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: '8px', width: '400px', marginBottom: '20px',
                 border: '1px solid #ccc' }}
      />

      {/* Add Book Form — Librarian only */}
      {role === 'librarian' && (
        <div>
          <h3>➕ Add New Book</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px',
                        marginBottom: '20px' }}>
            {Object.keys(form).map(key => (
              <input key={key} placeholder={key}
                onChange={e => setForm({...form, [key]: e.target.value})}
                style={{ padding: '6px', width: '150px',
                         border: '1px solid #ccc' }} />
            ))}
            <button onClick={addBook}
              style={{ padding: '8px 16px', background: '#1a237e',
                       color: 'white', border: 'none', cursor: 'pointer' }}>
              Add Book
            </button>
          </div>
        </div>
      )}

      {/* ✏️ Edit Modal — shows when edit button clicked */}
      {editBook && (
        <div style={{ position: 'fixed', top: 0, left: 0,
                      width: '100%', height: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', padding: '30px',
                        borderRadius: '8px', width: '600px',
                        maxHeight: '80vh', overflowY: 'auto' }}>
            <h3>✏️ Edit Book — {editBook.accession_no}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {Object.keys(editBook).map(key => (
                <div key={key}>
                  <label style={{ fontSize: '12px', color: '#555' }}>
                    {key}
                  </label><br/>
                  <input
                    value={editBook[key]}
                    disabled={key === 'accession_no'} // can't change primary key
                    onChange={e => setEditBook({...editBook, [key]: e.target.value})}
                    style={{ padding: '6px', width: '160px',
                             border: '1px solid #ccc',
                             background: key === 'accession_no' ? '#eee' : 'white' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button onClick={saveEdit}
                style={{ padding: '8px 20px', background: '#1a237e',
                         color: 'white', border: 'none', cursor: 'pointer' }}>
                💾 Save Changes
              </button>
              <button onClick={() => setEditBook(null)}
                style={{ padding: '8px 20px', background: '#ccc',
                         border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Books Table */}
      <table border="1" cellPadding="8"
             style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#1a237e', color: 'white' }}>
          <tr>
            <th>Accession No</th>
            <th>Book No</th>
            <th>Book Name</th>
            <th>Author</th>
            <th>Type</th>
            <th>Price</th>
            {role === 'librarian' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={role === 'librarian' ? 7 : 6}
                  style={{ textAlign: 'center', padding: '20px' }}>
                No books found
              </td>
            </tr>
          ) : (
            filtered.map(b => (
              <tr key={b.accession_no}>
                <td>{b.accession_no}</td>
                <td>{b.book_no}</td>
                <td>{b.bookname}</td>
                <td>{b.author}</td>
                <td>{b.type}</td>
                <td>₹{b.price}</td>
                {role === 'librarian' && (
                  <td style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleEditClick(b)}
                      style={{ background: '#f57c00', color: 'white',
                               border: 'none', cursor: 'pointer',
                               padding: '4px 10px' }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => deleteBook(b.accession_no, b.bookname)}
                      style={{ background: 'crimson', color: 'white',
                               border: 'none', cursor: 'pointer',
                               padding: '4px 10px' }}>
                      🗑️ Delete
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