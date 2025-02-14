const express = require('express');
const { Status, validate } = require('../models/status'); // Correct model import
const router = express.Router();

// Create a new status request
router.post('/status', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { requestId, status } = req.body;

    let existingStatus = await Status.findOne({ requestId });
    if (existingStatus) return res.status(400).send('Request ID already exists.');

    const newStatus = new Status({ requestId, status });
    await newStatus.save();
    res.send(newStatus);
});

// Update status
router.put('/status/:requestId', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { status } = req.body;
    const updatedStatus = await Status.findOneAndUpdate(
        { requestId: req.params.requestId },
        { status },
        { new: true }
    );

    if (!updatedStatus) return res.status(404).send('Request ID not found.');
    res.send(updatedStatus);
});

// Get status by requestId
router.get('/status/:requestId', async (req, res) => {
    const status = await Status.findOne({ requestId: req.params.requestId });
    if (!status) return res.status(404).send('Request ID not found.');
    res.send(status);
});

module.exports = router;
