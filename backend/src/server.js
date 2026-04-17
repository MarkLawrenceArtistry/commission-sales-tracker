require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 3000

const db = require('./database')

app.use(cors())
app.use(express.json())

const userRoutes = require('./routes/user')
const salesRoutes = require('./routes/sales')

app.use('/api/users', userRoutes)
app.use('/api/sales', salesRoutes)

process.on('SIGINT', () => {
    db.close((err) => {
        if(err) {
            console.error(`Error: ${err.message}`)
        }
        
        console.log('Closed the database connection successfully.')
        process.exit(0)
    })
})

app.listen(PORT, () => {
    console.log(`The app is listening at http://localhost:${PORT}`)
})