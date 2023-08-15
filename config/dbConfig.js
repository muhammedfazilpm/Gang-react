require('dotenv').config()
const mongoose = require('mongoose')
console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection

connection.on('connected', () => console.log('mongodb has been success fully connected'))
connection.on('error', (error) => console.log('mongodb conncted has fail', error))
module.exports = mongoose

