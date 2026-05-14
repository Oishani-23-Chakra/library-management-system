import { useState } from 'react'
import axios from 'axios'

const API = 'http://127.0.0.1:5000/api'

export default function IssueReturn() {
  const [issueForm, setIssueForm] = useState({
    issueid:'', membership_no:'', accession_no:''
  })
  const [returnForm, setReturnForm] = useState({
    issueid:'', accession_no:''
  })
  const [fine, setFine] = useState(null)

  const issueBook = async () => {
    const res = await axios.post(`${API}/issue`, issueForm)
    alert(`${res.data.message} Due date: ${res.data.due_date}`)
  }

  const returnBook = async () => {
    const res = await axios.post(`${API}/return`, returnForm)
    setFine(res.data.fine)
    alert(res.data.message)
  }

  return (
    <div style={{ display: 'flex', gap: '40px' }}>

      {/* Issue */}
      <div>
        <h2>📤 Issue Book</h2>
        {Object.keys(issueForm).map(key => (
          <div key={key} style={{ marginBottom: '8px' }}>
            <input placeholder={key}
              onChange={e => setIssueForm({...issueForm, [key]: e.target.value})}
              style={{ padding: '6px', width: '200px' }} />
          </div>
        ))}
        <button onClick={issueBook}
          style={{ padding: '8px 16px', background: '#1a237e',
                   color: 'white', border: 'none', cursor: 'pointer' }}>
          Issue Book
        </button>
      </div>

      {/* Return */}
      <div>
        <h2>📥 Return Book</h2>
        {Object.keys(returnForm).map(key => (
          <div key={key} style={{ marginBottom: '8px' }}>
            <input placeholder={key}
              onChange={e => setReturnForm({...returnForm, [key]: e.target.value})}
              style={{ padding: '6px', width: '200px' }} />
          </div>
        ))}
        <button onClick={returnBook}
          style={{ padding: '8px 16px', background: 'green',
                   color: 'white', border: 'none', cursor: 'pointer' }}>
          Return Book
        </button>
        {fine !== null && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            Fine: ₹{fine}
          </p>
        )}
      </div>
    </div>
  )
}