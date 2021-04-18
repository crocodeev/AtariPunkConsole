require('dotenv').config()


const PORT = process.env.PORT
const express = require('express')
const app = express()

app.use(express.static('public'))

app.listen(PORT, () => {
    console.log(`listen on http://localhost:${PORT}`)
})