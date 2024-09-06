const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./students.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL
    )`);
});

module.exports = db;
