const express = require('express')
const Note = require("./../models/note")
const { trusted } = require('mongoose')
const router = express.Router()


// to create new note
router.get('/new_note',(req,res) => {
    res.render('notes/new_note', {note : new Note()})
})

router.get('/edit_note/:id', async (req,res) => {
    var note = await Note.findById(req.params.id)
    res.render('notes/edit_note', {note : note})
})

// note pinning
router.get('/update_note_pin/:id', async(req,res) =>{
  
    var note =   await Note.findByIdAndUpdate(req.params.id);
   // console.log("\n\nThe pin btn note : ",note)
    note.isPinned = !note.isPinned;
    //console.log("\n\nAfter The pin btn note : ",note)
    try{
        note = await note.save()
        res.redirect('/')
    }
    catch(e){
        res.redirect('/')
    }
})

// After saving  or cancel  route to using a slug of the title. 
router.get('/:slug', async (req,res) =>{
    const note = await Note.findOne({slug: req.params.slug})
    if(note == null) res.redirect('/')
    res.render('notes/show_note', {note : note})
})  

// get data of the new note
router.post('/', async (req, res, next) =>{
    req.note = new Note()
    // to slugify the title for url creation
    next()
}, saveNoteAndRedirect('new_note'))

// edit note content
router.put('/:id', async (req,res,next) => {  
    req.note = await Note.findById(req.params.id)
    next()
}, editNoteAndRedirect('edit_note')) 

// Delete Note

router.delete('/:id', async (req,res) =>{
    await Note.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

// to fetch details from the note form
function saveNoteAndRedirect(path){
    return  async (req, res) => {
        let note = req.note
        note.title= req.body.title
        note.description = req.body.description 
        try{
            note = await note.save()
            res.redirect(`/notes/${note.slug}`)
        }
        catch(e){
            res.render(`notes/${path}`,{note:note})
        }
    }
}

function editNoteAndRedirect(path){
    return  async (req, res) => {
        let note = req.note
        note.title= req.body.title
        note.description = req.body.description
        note.editedAt = Date(Date.now()) /* setting up the time when edited */
        try{
            note = await note.save()
            res.redirect(`/notes/${note.slug}`)
        }
        catch(e){
            res.render(`notes/${path}`,{note:note})
        }
    }
}

// export route
module.exports = router