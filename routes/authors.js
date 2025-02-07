const mongoose = require('mongoose');
const Joi = require('joi');
const express = require("express");
const router = express.Router();

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

router.get('/api/authors', async (req, res) => {
    const authors = await Author.find().sort('name');
    res.send(authors);
});

router.get('/api/authors/:id', async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (!author) {
        return res.status(404).send("Id bo'yicha qidirilgan author topilmadi");
    }
    res.send(author);
});

router.post('/api/authors', async (req, res) => {
    const { error } = validateAuthor(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let author = new Author(req.body);
    author = await author.save();
    res.status(201).send(author);
});

router.put('/api/authors/:id', async (req, res) => {
    const { error } = validateAuthor(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!author) {
        return res.status(404).send("Kiritilgan ID bo'yicha ma'lumot topilmadi");
    }
    res.send(author);
});

router.delete('/api/authors/:id', async (req, res) => {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
        return res.status(404).send("Kiritilgan ID bo'yicha ma'lumot topilmadi");
    }
    res.send(author);
});

module.exports = router;

exports.Author = Author;
exports.validate = validateAuthor;
