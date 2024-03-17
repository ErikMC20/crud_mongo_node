const mongoose = require('mongoose');

// definimos nuestro esquema
const bookSchema = new mongoose.Schema({
    title:String,
    author:String,
    gender:String,
    publication_date:String
})

// exportamos el mongo model
module.exports = mongoose.model('Books', bookSchema);
