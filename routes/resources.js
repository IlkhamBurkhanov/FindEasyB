const express = require('express');
const router = express.Router();
const { Resource, validate } = require('../models/resource');

// Get all resources, sorted by requestId
router.get('/api/resources', async (req, res) => {
    try {
        const resources = await Resource.find().sort("requestId");
        res.send(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Get resources by spousePinfl
router.get('/api/resources/spouse/:spousePinfl', async (req, res) => {
    const { spousePinfl } = req.params;

    try {
        // Ensure spousePinfl is treated as a string
        const resources = await Resource.find({ "params.spousePinfl": String(spousePinfl) });

        if (!resources || resources.length === 0) {
            return res.status(404).json({ message: 'No resources found for this spouse PINFL' });
        }

        res.json(resources);
    } catch (err) {
        console.error('Error fetching spousePinfl data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Get a single resource by requestId
router.get('/api/resources/request/:requestId', async (req, res) => {
    const { requestId } = req.params;

    try {
        const resource = await Resource.findOne({ requestId });
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.json(resource);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get resources by coBorrower's PINFL
router.get('/api/resources/coBorrower/:pinfl', async (req, res) => {
    const { pinfl } = req.params;

    try {
        const resources = await Resource.find({ coBorrower: pinfl });
        if (resources.length === 0) {
            return res.status(404).json({ message: 'No resources found for this coBorrower PINFL' });
        }
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get resources by borrower's PINFL (user can get their own)
router.get('/api/resources/borrower/:pinfl', async (req, res) => {
    const { pinfl } = req.params;

    try {
        const resources = await Resource.find({ borrower: pinfl });
        if (resources.length === 0) {
            return res.status(404).json({ message: 'No resources found for this borrower PINFL' });
        }
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create a new resource
router.post('/api/resources', async (req, res) => {
    const { requestId, coBorrower, borrower, params } = req.body;

    // Validate request body
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Create a new resource
        const resource = new Resource({
            requestId,
            coBorrower,
            borrower,
            params
        });

        // Save the resource to the database
        await resource.save();

        res.status(201).json(resource);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
