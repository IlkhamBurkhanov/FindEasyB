// routes/resources.js

const express = require('express');
const router = express.Router();
const { Resource, validate } = require('../models/resource');
const {Category} = require('../models/category')
router.get('/api/resources', async (req, res)=> {
    const resource  = await Resource.find().sort("requestId")
    res.send(resource)
})
//
// router.get('/api/resources/category/:categoryId', async (req, res) => {
//     const categoryId = req.params.categoryId;
//
//     try {
//         // Find resources belonging to the specified category
//         const resources = await Resource.find({ category: categoryId });
//         if (resources.length === 0) {
//             return res.status(404).send('No resources found for this category ID');
//         }
//         res.send(resources);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// });
router.get('/api/resources/:pinfl', async (req, res) => {
    const pinfl = req.params.pinfl;

    try {
        // Find resources by coBorrower (PINFL)
        const resources = await Resource.find({ coBorrower: pinfl });
        if (resources.length === 0) {
            return res.status(404).json({ message: 'No resources found for this PINFL' });
        }
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.post('/api/resources', async (req, res) => {
    const { requestId, coBorrower} = req.body;

    // Validate the request body
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        // Create a new resource
        const resource = new Resource({
            requestId,
            coBorrower,
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
