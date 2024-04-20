// generate schema
const mongoose = require('mongoose')
const slugify =  require('slugify')

const NotesSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    editedAt:{
        type:Date
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    slug:{
        type:String,
        required: true,
        unique: true
    },
    isPinned:{
        type:Boolean,
        default:false
    }
})
// slug is used to ahow the title of the note in the link instead of id
NotesSchema.pre('validate',function(next){
    if(this.title){
        this.slug = slugify(this.title,{lower: true, strict : true})
    }
    next()
})


module.exports = mongoose.model('note',NotesSchema)