const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')

const db = new sqlite3.Database('./data.db', (err) => {
    if(err) {
        return console.error(`Error connecting to the database: ${err.message}.`)
    }

    console.log('Connected successfully to the database.')
})

db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON;', (err) => {
        if(err) {
            console.log(err.message);
        }
    })

    // query declarations
    const userQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deletion_requested_at TIMESTAMP
        )
    `;
    const salesQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount TEXT NOT NULL,
            description TEXT,
            date TEXT NOT NULL
        )
    `;


    // function calls
    db.run(userQuery, [], function(err) {
        if(err) {
            return console.error(`Error: ${err.message}.`)
        }
    })
     db.run(salesQuery, [], function(err) {
        if(err) {
            return console.error(`Error: ${err.message}.`)
        }
    })

    bcrypt.hash("Admin123!", 10, (err, hash) => {
        db.run('INSERT OR IGNORE INTO users (email, password_hash, name) VALUES (?, ?, ?)',
            ["marklawrencecatubay@gmail.com", hash, "Mark Lawrence"], function(err) {
            if(err) {
                return
            }
        })
    })

    console.log('CREATED DATABASE SUCCESSFULLY.')
})

db.on('error', (err) => {
    console.error(`[DB ERROR]: ${err.message}`)
})

module.exports = db