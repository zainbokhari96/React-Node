const connectToMongo = require("./db")
const express = require('express')

connectToMongo();
const app = express()
const port = 3000

// Use Json In Request For Endpoints
app.use(express.json())

// Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`My app listening at http://localhost:${port}`)
})