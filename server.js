const express = require('express')
const mongoose = require('mongoose')
const NoteRouter = require('./routes/notes')
const Note = require('./models/note')
const methodOverride = require('method-override')
const app = express();

//connect to the mongodb database
mongoose.connect('mongodb://localhost:27017/NoteApp')

// Set the view engine to EJS (Embedded JavaScript)
app.set('view engine','ejs')

// Middleware for parsing url-encoded data and method override meaning the url will be a string or array.
app.use(express.urlencoded({extended:false}))

// To support te use of PUT or  DELETE HTTP methods which is not supported by html form.
app.use(methodOverride('_method'))

// JS promise
app.get('/', async (req,res) =>{
    // show recently created .
    const notes = await Note.find().sort({isPinned:'desc'}) 
    res.render('notes/main', {notes: notes});
})

// use of notes file which consist CRUD operation routes
app.use('/notes',NoteRouter)


// Start the Express app and listen on port 5000
app.listen(5000)
