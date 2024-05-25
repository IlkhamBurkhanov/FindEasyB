// routes/resources.js

const express = require('express');
const router = express.Router();
const { Resource, validate } = require('../models/resource');
const {Category} = require('../models/category')
router.get('/api/resources', async (req, res)=> {
    const resource  = await Resource.find().sort("title")
    res.send(resource)
})
router.get('/api/resources/category/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        // Find resources belonging to the specified category
        const resources = await Resource.find({ category: categoryId });
        if (resources.length === 0) {
            return res.status(404).send('No resources found for this category ID');
        }
        res.send(resources);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/api/resources/author/:authorId', async (req, res) => {
    const authorId = req.params.authorId;

    try {
        // Find resources authored by the specified author
        const resources = await Resource.find({ author: authorId });
        if (resources.length === 0) {
            return res.status(404).send('No resources found for this author ID');
        }
        res.send(resources);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/api/resources', async (req, res) => {
    const { title, category, author, link, tag } = req.body;

    // Validate the request body
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        // Create a new resource
        const resource = new Resource({
            title,
            category,
            author,
            link,
            tag
        });

        // Save the resource to the database
        await resource.save();

        // Send the newly created resource in the response
        res.status(201).send(resource);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
