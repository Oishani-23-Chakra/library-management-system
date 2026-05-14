import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://127.0.0.1:5000/api'

export default function Members() {
  const [members, setMembers] = useState([])
  const [form, setForm] = useState({
    membership_no:'', name:'', phone:'', membership_date:'',
    adhar_no:'', dob:'', guardian:'', gender:''
  })
  const [editMember, setEditMember] = useState(null)

  const fetchMembers = async () => {
    const res = await axios.get(`${API}/members`)
    setMembers(res.data)
  }

  useEffect(() => { fetchMembers() }, [])

  const addMember = async () => {
    if (!form.membership_no || !form.name || !form.phone) {
      alert('❌ Membership No, Name and Phone are required!')
      return
    }
    if (form.phone.length !== 10) {
      alert('❌ Phone must be 10 digits!')
      return
    }
    await axios.post(`${API}/members`, form)
    alert('✅ Member added successfully!')
    fetchMembers()
  }

  const handleEditClick = (m) => {
    setEditMember({
      membership_no: m.membership_no,
      name: m.name,
      phone: m.phone,
      membership_date: m.membership_date || '',
      dob: m.dob || '',
      gender: m.gender || '',
    })
  }

  const saveEdit = async () => {
    if (!editMember.name || !editMember.phone) {
      alert('❌ Name and Phone are required!')
      return
    }
    if (editMember.phone.length !== 10) {
      alert('❌ Phone must be 10 digits!')
      return
    }
    await axios.put(`${API}/members/${editMember.membership_no}`, editMember)
    alert('✅ Member updated successfully!')
    setEditMember(null)
    fetchMembers()
  }

  return (
    <div>
      <h2>👤 Member Management</h2>

      {/* Add Member Form */}
      <h3>➕ Add New Member</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px',
                    marginBottom: '20px' }}>
        {Object.keys(form).map(key => (
          <div key={key}>
            <label style={{ fontSize: '12px', color: '#555' }}>{key}</label><br/>
            <input placeholder={key}
              onChange={e => setForm({...form, [key]: e.target.value})}
              style={{ padding: '6px', width: '140px',
                       border: '1px solid #ccc' }} />
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button onClick={addMember}
            style={{ padding: '8px 16px', background: '#1a237e',
                     color: 'white', border: 'none', cursor: 'pointer' }}>
            Add Member
          </button>
        </div>
      </div>

      {/* ✏️ Edit Modal */}
      {editMember && (
        <div style={{ position: 'fixed', top: 0, left: 0,
                      width: '100%', height: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', padding: '30px',
                        borderRadius: '8px', width: '500px' }}>
            <h3>✏️ Edit Member — {editMember.membership_no}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {Object.keys(editMember).map(key => (
                <div key={key}>
                  <label style={{ fontSize: '12px', color: '#555' }}>
                    {key}
                  </label><br/>
                  <input
                    value={editMember[key]}
                    disabled={key === 'membership_no'}
                    onChange={e => setEditMember({...editMember,
                                  [key]: e.target.value})}
                    style={{ padding: '6px', width: '160px',
                             border: '1px solid #ccc',
                             background: key === 'membership_no'
                                         ? '#eee' : 'white' }}
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
              <button onClick={() => setEditMember(null)}
                style={{ padding: '8px 20px', background: '#ccc',
                         border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Table */}
      <table border="1" cellPadding="8"
             style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#1a237e', color: 'white' }}>
          <tr>
            <th>Membership No</th><th>Name</th><th>Phone</th>
            <th>Gender</th><th>DOB</th><th>Membership Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                No members found
              </td>
            </tr>
          ) : (
            members.map(m => (
              <tr key={m.membership_no}>
                <td>{m.membership_no}</td>
                <td>{m.name}</td>
                <td>{m.phone}</td>
                <td>{m.gender}</td>
                <td>{m.dob}</td>
                <td>{m.membership_date}</td>
                <td>
                  <button onClick={() => handleEditClick(m)}
                    style={{ background: '#f57c00', color: 'white',
                             border: 'none', cursor: 'pointer',
                             padding: '4px 10px' }}>
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}