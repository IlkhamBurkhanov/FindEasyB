
const mongoose = require('mongoose')
const Joi = require('joi')

const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    workLocation: {
        type: String,
        required: true,
        trim: true

    },
    experience:{
        type: String,
        required: true,

    }
})

const Author = mongoose.model('Auhtor', AuthorSchema)


function validateAuthor(book) {
    const AuthorSchema = Joi.object({ 
        name:Joi.string().required().min(3).max(255),
        workLocation: Joi.string().required().min(3),
        experience: Joi.string().required().min(1).max(50)

    })

   return  AuthorSchema.validate(book)
  
  
    
 }

 exports.Author = Author
 exports.validate = validateAuthor
