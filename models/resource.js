const mongoose = require('mongoose');
const Joi = require('joi')

const resourceSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true
    },
    coBorrower: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Author',
        // required: true
        type: String,
        required: true
    },
});

const Resource = mongoose.model('Resource', resourceSchema);


function validateResourses(book) {
    const ResourceSchema = Joi.object({
    requestId: Joi.string().required(),
    coBorrower: Joi.string().required(),

       })

   return  ResourceSchema.validate(book)
  
  
    
 }
 

 exports.Resource = Resource
 exports.validate = validateResourses