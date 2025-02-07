const mongoose = require('mongoose');
const Joi = require('joi');

const BorrowerSchema = new mongoose.Schema({
    requestId: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'] }
});

const MarriageSchema = new mongoose.Schema({
    requestId: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'] }
});

const AuthorSchema = new mongoose.Schema({
    pinfl: { type: String, required: true, trim: true, minlength: 14, maxlength: 14 },
    phone: { type: String, required: true, minlength: 7 },
    clientCode: { type: String, required: true, minlength: 1, maxlength: 50 },
    borrower: { type: [BorrowerSchema], required: true },
    coBorrower: { type: [BorrowerSchema], required: false },
    marriage: { type: [MarriageSchema], required: false },
    requestId: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'] }
});

const Author = mongoose.model('Author', AuthorSchema);

function validateAuthor(author) {
    const schema = Joi.object({
        pinfl: Joi.string().length(14).required(),
        phone: Joi.string().min(7).required(),
        clientCode: Joi.string().min(1).max(50).required(),
        borrower: Joi.array().items(Joi.object({
            requestId: Joi.string().required(),
            status: Joi.string().valid('pending', 'approved', 'rejected').required()
        })).required(),
        coBorrower: Joi.array().items(Joi.object({
            requestId: Joi.string().required(),
            status: Joi.string().valid('pending', 'approved', 'rejected').required()
        })).optional(),
        marriage: Joi.array().items(Joi.object({
            requestId: Joi.string().required(),
            status: Joi.string().valid('pending', 'approved', 'rejected').required()
        })).optional(),
        requestId: Joi.string().required(),
        status: Joi.string().valid('pending', 'approved', 'rejected').required()
    });
    return schema.validate(author);
}

exports.Author = Author;
exports.validate = validateAuthor;
