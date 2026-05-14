from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from datetime import date, timedelta

app = Flask(__name__)
CORS(app)

# ✅ Your existing DB connection (same as your project)
import os
from dotenv import load_dotenv

load_dotenv()  # reads the .env file

mycon = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    passwd=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME'),
    ssl_disabled=True
)

cur = mycon.cursor()

# ===================== AUTH =====================

@app.route('/api/auth/signin', methods=['POST'])
def sign_in():
    data = request.json
    uid = data.get('uid')
    cur.execute("SELECT COUNT(*) FROM idtable WHERE uid=%s", (uid,))
    result = cur.fetchone()
    if result[0] == 0:
        return jsonify({"success": False, "message": "User ID not found!"})
    return jsonify({"success": True, "message": "Signed in successfully!"})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    phone = data.get('phone')
    uid = data.get('uid')
    cur.execute("INSERT INTO idtable(name, phn, uid) VALUES (%s,%s,%s)",
                (name, phone, uid))
    mycon.commit()
    return jsonify({"success": True, "message": "User ID created!"})

# ===================== BOOKS =====================

@app.route('/api/books', methods=['GET'])
def get_all_books():
    cur.execute("SELECT * FROM book_master")
    rows = cur.fetchall()
    books = [{"accession_no": r[0], "book_no": r[1], "bookname": r[2],
              "author": r[3], "publisher": r[4], "price": float(r[9] or 0),
              "language": r[10], "type": r[11], "class": r[12]} for r in rows]
    return jsonify(books)

@app.route('/api/books', methods=['POST'])
def add_book():
    d = request.json
    cur.execute("""INSERT INTO book_master VALUES
        (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (d['accession_no'], d['book_no'], d['bookname'], d['author'],
         d['publisher'], d['pubdate'], d['source'], d['rcv_date'],
         d['volume'], d['price'], d['language'], d['type'], d['class']))
    mycon.commit()
    return jsonify({"message": "Book added successfully!"})

# ⚠️ This MUST be placed BEFORE the /api/books/<accession_no> routes
@app.route('/api/search', methods=['GET'])
def search_books():
    query = request.args.get('q', '')
    cur.execute("""
        SELECT b.accession_no, b.bookno, b.bookname, b.author,
               b.publisher, b.type, b.language, b.price,
               CASE 
                   WHEN EXISTS (
                       SELECT 1 FROM issue_return i 
                       WHERE i.accession_no = b.accession_no 
                       AND i.actual_return_date IS NULL
                   ) THEN 'Issued'
                   ELSE 'Available'
               END AS status
        FROM book_master b
        WHERE b.bookname LIKE %s
           OR b.author LIKE %s
           OR b.type LIKE %s
           OR b.accession_no LIKE %s
    """, (f'%{query}%', f'%{query}%', f'%{query}%', f'%{query}%'))
    rows = cur.fetchall()
    result = []
    for r in rows:
        result.append({
            "accession_no": r[0],
            "book_no": r[1],
            "bookname": r[2],
            "author": r[3],
            "publisher": r[4],
            "type": r[5],
            "language": r[6],
            "price": float(r[7]) if r[7] else 0.0,
            "status": r[8]
        })
    return jsonify(result)
@app.route('/api/books/<accession_no>', methods=['DELETE'])
def delete_book(accession_no):
    cur.execute("DELETE FROM book_master WHERE accession_no=%s", (accession_no,))
    mycon.commit()
    return jsonify({"message": "Book deleted!"})

@app.route('/api/books/<accession_no>', methods=['PUT'])
def update_book(accession_no):
    d = request.json
    cur.execute("""UPDATE book_master SET
        bookname=%s, author=%s, publisher=%s, publishingdate=%s,
        source=%s, book_rcv_date=%s, volume=%s, price=%s,
        language=%s, type=%s, class=%s
        WHERE accession_no=%s""",
        (d['bookname'], d['author'], d['publisher'], d['pubdate'],
         d['source'], d['rcv_date'], d['volume'], d['price'],
         d['language'], d['type'], d['class'], accession_no))
    mycon.commit()
    return jsonify({"message": "Book updated successfully!"})
'''@app.route('/api/books/search', methods=['GET'])
def search_books():
    query = request.args.get('q', '')
    cur.execute("""
        SELECT b.accession_no, b.bookno, b.bookname, b.author,
               b.publisher, b.type, b.language, b.price,
               CASE 
                   WHEN EXISTS (
                       SELECT 1 FROM issue_return i 
                       WHERE i.accession_no = b.accession_no 
                       AND i.actual_return_date IS NULL
                   ) THEN 'Issued'
                   ELSE 'Available'
               END AS status
        FROM book_master b
        WHERE b.bookname LIKE %s
           OR b.author LIKE %s
           OR b.type LIKE %s
           OR b.accession_no LIKE %s
    """, (f'%{query}%', f'%{query}%', f'%{query}%', f'%{query}%'))
    rows = cur.fetchall()
    result = []
    for r in rows:
        result.append({
            "accession_no": r[0],
            "book_no": r[1],
            "bookname": r[2],
            "author": r[3],
            "publisher": r[4],
            "type": r[5],
            "language": r[6],
            "price": float(r[7]) if r[7] else 0.0,
            "status": r[8]
        })
    return jsonify(result)'''
# ===================== MEMBERS =====================

@app.route('/api/members', methods=['GET'])
def get_all_members():
    cur.execute("SELECT * FROM member_master")
    rows = cur.fetchall()
    members = [{"membership_no": r[0], "name": r[1], "phone": r[2],
                "membership_date": str(r[3]), "dob": str(r[5]),
                "gender": r[7]} for r in rows]
    return jsonify(members)

@app.route('/api/members', methods=['POST'])
def add_member():
    d = request.json
    cur.execute("""INSERT INTO member_master VALUES
        (%s,%s,%s,%s,%s,%s,%s,%s)""",
        (d['membership_no'], d['name'], d['phone'], d['membership_date'],
         d['adhar_no'], d['dob'], d['guardian'], d['gender']))
    mycon.commit()
    return jsonify({"message": "Member added successfully!"})

@app.route('/api/members/<membership_no>', methods=['PUT'])
def update_member(membership_no):
    d = request.json
    cur.execute("""UPDATE member_master SET
        membername=%s, phone_no=%s, dob=%s, gender=%s
        WHERE membership_no=%s""",
        (d['name'], d['phone'], d['dob'], d['gender'], membership_no))
    mycon.commit()
    return jsonify({"message": "Member updated successfully!"})
# ===================== ISSUE / RETURN =====================

@app.route('/api/issue', methods=['POST'])
def issue_book():
    d = request.json
    issue_date = date.today()
    due_date = issue_date + timedelta(days=15)
    cur.execute("SELECT * FROM book_master WHERE accession_no=%s", (d['accession_no'],))
    if not cur.fetchone():
        return jsonify({"error": "Book not found!"}), 404
    cur.execute("""INSERT INTO issue_return
        (issueid, membership_no, accession_no, issue_date, return_due_date)
        VALUES (%s,%s,%s,%s,%s)""",
        (d['issueid'], d['membership_no'], d['accession_no'], issue_date, due_date))
    mycon.commit()
    return jsonify({"message": "Book issued!", "due_date": str(due_date)})

@app.route('/api/return', methods=['POST'])
def return_book():
    d = request.json
    today = date.today()
    cur.execute("""UPDATE issue_return SET actual_return_date=%s
        WHERE accession_no=%s AND issueid=%s""",
        (today, d['accession_no'], d['issueid']))
    mycon.commit()
    cur.execute("SELECT return_due_date FROM issue_return WHERE issueid=%s", (d['issueid'],))
    row = cur.fetchone()
    due = row[0]
    diff = (today - due).days
    fine = max(0, diff * 1.0)
    return jsonify({"message": "Book returned!", "fine": fine})

# ===================== REPORTS =====================

@app.route('/api/reports/issued', methods=['GET'])
def issued_books():
    cur.execute("""SELECT b.accession_no, b.bookno, b.bookname, b.author,
        m.membership_no, m.membername, i.issue_date
        FROM book_master b
        JOIN issue_return i ON b.accession_no = i.accession_no
        JOIN member_master m ON m.membership_no = i.membership_no
        WHERE i.actual_return_date IS NULL""")
    rows = cur.fetchall()
    result = [{"accession_no": r[0], "book_no": r[1], "bookname": r[2],
               "author": r[3], "membership_no": r[4],
               "member_name": r[5], "issue_date": str(r[6])} for r in rows]
    return jsonify(result)

@app.route('/api/reports/genre/<genre>', methods=['GET'])
def books_by_genre(genre):
    cur.execute("SELECT bookno, bookname FROM book_master WHERE type=%s", (genre,))
    rows = cur.fetchall()
    return jsonify([{"book_no": r[0], "bookname": r[1]} for r in rows])
# ===================== MYBOOKS =====================
@app.route('/api/mybooks/<uid>', methods=['GET'])
def my_books(uid):
    cur.execute("""
        SELECT b.accession_no, b.bookno, b.bookname, b.author,
               i.issue_date, i.return_due_date, i.actual_return_date,
               i.fine
        FROM issue_return i
        JOIN book_master b ON i.accession_no = b.accession_no
        JOIN idtable id ON id.uid = %s
        WHERE i.membership_no = (
            SELECT membership_no FROM member_master
            WHERE phone_no = (
                SELECT phn FROM idtable WHERE uid = %s
            )
        )
    """, (uid, uid))
    rows = cur.fetchall()
    result = []
    for r in rows:
        result.append({
            "accession_no": r[0],
            "book_no": r[1],
            "bookname": r[2],
            "author": r[3],
            "issue_date": str(r[4]) if r[4] else '',
            "due_date": str(r[5]) if r[5] else '',
            "return_date": str(r[6]) if r[6] else 'Not returned yet',
            "fine": float(r[7]) if r[7] else 0.0
        })
    return jsonify(result)

# ===================== RUN =====================

if __name__ == '__main__':
    app.run(debug=True)