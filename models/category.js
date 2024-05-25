
const mongoose = require('mongoose')
const Joi = require('joi')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    }
})

const Category = mongoose.model('Category', CategorySchema)


function validateCategory(book) {
    const CategorySchema = Joi.object({ 
        name:Joi.string().required().min(3).max(255)

    })

   return  CategorySchema.validate(book)
  
}

 exports.Category = Category
 exports.validate = validateCategory
