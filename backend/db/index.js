const express = require('express');
const db = require('./db/database');
const app = express();
const PORT = 5000;

app.use(express.json());

// POST - Create New Student
app.post('/students', (req, res) => {
    const { first_name, last_name, email, phone } = req.body;
    const stmt = db.prepare('INSERT INTO students (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)');
    stmt.run([first_name, last_name, email, phone], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ studentId: this.lastID });
    });
});

// GET - Retrieve All Students
app.get('/students', (req, res) => {
    db.all('SELECT * FROM students', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ students: rows });
    });
});

// GET - Retrieve Student by ID
app.get('/students/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(row);
    });
});

// PUT - Update Student by ID
app.put('/students/:id', (req, res) => {
    const { first_name, last_name, email, phone } = req.body;
    const { id } = req.params;
    db.run('UPDATE students SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?',
        [first_name, last_name, email, phone, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ updated: this.changes });
        });
});

// DELETE - Delete Student by ID
app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM students WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
