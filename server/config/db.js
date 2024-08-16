const mongoose = require('mongoose')
const dbURL = process.env.dbURL
const dbName = 'Nalanda_Library_Management_System'

const connectDB = {
    connect: () => {
        mongoose.connect(dbURL, { dbName }, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.error('Error connecting to MongoDB:', error));
    }
}
  
module.exports = connectDB