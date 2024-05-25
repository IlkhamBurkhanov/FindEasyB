const mongoose = require('mongoose');
const Joi = require('joi')

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    link: {
        type: String,
        required: true
    },
    tag: {
        type: String
    }
});

const Resource = mongoose.model('Resource', resourceSchema);


function validateResourses(book) {
    const ResourceSchema = Joi.object({ 
    title: Joi.string().required(),
    category: Joi.string().required(), // Assuming category is a string for now
    author: Joi.string().required(),   // Assuming author is a string for now
    link: Joi.string().uri().required(),
    tag: Joi.string().optional()

       })

   return  ResourceSchema.validate(book)
  
  
    
 }
 

 exports.Resource = Resource
 exports.validate = validateResourses