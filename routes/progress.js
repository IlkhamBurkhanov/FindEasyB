const express = require('express');
const { Progress, SubStage, validateProgress, validateSubStage } = require('../models/progress');
const router = express.Router();

// ✅ 1. Asosiy progress yaratish
// router.post('/progress', async (req, res) => {
//     const { error } = validateProgress(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//
//     const { requestId, status, pinfl } = req.body;
//
//     let existingProgress = await Progress.findOne({ requestId });
//     if (existingProgress) return res.status(400).send('Request ID already exists.');
//
//     const progress = new Progress({ requestId, status, pinfl, subStages: [] });
//     await progress.save();
//     res.send(progress);
// });
router.post('/progress', async (req, res) => {
    const { requestId, status, pinfl, subStages = [] } = req.body;

    let existingProgress = await Progress.findOne({ requestId });
    if (existingProgress) return res.status(400).send('Request ID already exists.');

    // ✅ Assign a unique ID to each subStage
    const updatedSubStages = subStages.map(subStage => ({
        ...subStage,
        subStageId: subStage.subStageId || new mongoose.Types.ObjectId().toString()
    }));

    const progress = new Progress({ requestId, status, pinfl, subStages: updatedSubStages });
    await progress.save();
    res.send(progress);
});

// ✅ 2. Asosiy progress statusini o‘zgartirish
router.put('/progress/:requestId', async (req, res) => {
    const { error } = validateProgress(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { status } = req.body;
    const progress = await Progress.findOneAndUpdate(
        { requestId: req.params.requestId },
        { status },
        { new: true }
    );

    if (!progress) return res.status(404).send('Request ID not found.');
    res.send(progress);
});

// ✅ 3. Asosiy progressni olish
router.get('/progress/:requestId', async (req, res) => {
    const progress = await Progress.findOne({ requestId: req.params.requestId });
    if (!progress) return res.status(404).send('Request ID not found.');
    res.send(progress);
});

// ✅ 4. Kichik progress (SubStage) qo‘shish
router.post('/progress/:requestId/substage', async (req, res) => {
    const { error } = validateSubStage(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { subStageId, requestId, status, stageName, pinfl } = req.body;

    const progress = await Progress.findOne({ requestId });
    if (!progress) return res.status(404).send('Progress not found.');

    const newSubStage = { subStageId, requestId, status, stageName, pinfl };
    progress.subStages.push(newSubStage);
    await progress.save();

    res.send(progress);
});
//get subStage with requestId and pinfl
router.get('/progress/:requestId/substage/:pinfl', async (req, res) => {
    const progress = await Progress.findOne({ requestId: req.params.requestId });

    if (!progress) return res.status(404).send('Progress not found.');


    const subStage = progress.subStages.find(s => s.pinfl === req.params.pinfl);
    if (!subStage) return res.status(404).send('SubStage not found.');

    res.send(subStage);
});

// ✅ 5. Kichik progress statusini o‘zgartirish va asosiy progressni yangilash
router.put('/progress/:requestId/substage/:pinfl', async (req, res) => {
    const { error } = validateSubStage(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { status } = req.body;

    const progress = await Progress.findOne({ requestId: req.params.requestId });
    if (!progress) return res.status(404).send('Progress not found.');

    const subStage = progress.subStages.find(s => s.pinfl === req.params.pinfl);
    if (!subStage) return res.status(404).send('SubStage not found.');

    subStage.status = status;

    // Asosiy progress statusini avtomatik yangilash
    const allCompleted = progress.subStages.every(s => s.status === 'application_signed_co');
    const anyFailed = progress.subStages.some(s => s.status === 'refucal_client');

    if (anyFailed) {
        progress.status = 'refucal_bank';
    } else if (allCompleted) {
        progress.status = 'approved_coborrower';
    }

    await progress.save();
    res.send(progress);
});

module.exports = router;
