const mongoose = require('mongoose');
const Joi = require('joi');

// Kichik progress (SubStage) modeli
const SubStageSchema = new mongoose.Schema({
    subStageId: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(), // Generates a unique ID if not provided
        required: false  // Allow empty subStages

    },
    documentId: { type: String, required: false },
    requestId: { type: String, required: false },
    status: {
        type: String,
        required: true,
        enum: ['receive_application', 'document_genetered_co', 'application_signed_co', 'refusal_bank', 'refusal_client', 'credit_doc_genereted', 'credit_doc_signed'],
        default: 'pending'
    },
    stageName: { type: String, required: false },
    pinfl: { type: String, required: false }
});

// Asosiy progress (Progress) modeli
const ProgressSchema = new mongoose.Schema({
    requestId: { type: String, required: true, unique: true },
    status: {
        type: String,
        required: true,
        enum: ['document_genereted', 'face_sign', 'application_signed', 'refusal_bank', 'refusal_client', 'add_coBorrower', 'wait_coBorrower', 'approved_coborrower'],
        default: 'getDocument'
    },
    pinfl: { type: String, required: true },
    documentId: { type: String, required: false },
    subStages: { type: [SubStageSchema], default: [] }
});

const Progress = mongoose.model('Progress', ProgressSchema);
const SubStage = mongoose.model('SubStage', SubStageSchema);

function validateProgress(data) {
    const schema = Joi.object({
        requestId: Joi.string().required(),
        status: Joi.string().valid('document_genereted', 'face_sign', 'application_signed', 'refusal_bank', 'refusal_client', 'add_coBorrower', 'wait_coBorrower', 'approved_coborrower').required(),
        pinfl: Joi.string().required(),
        documentId: Joi.string().optional(),
    });
    return schema.validate(data);
}

// Kichik progress uchun validatsiya
function validateSubStage(data) {
    const schema = Joi.object({
        subStageId: Joi.string(),
        requestId: Joi.string(),
        status: Joi.string().valid('receive_application', 'document_genetered_co', 'application_signed_co', 'refusal_bank', 'refusal_client', 'credit_doc_genereted', 'credit_doc_signed').required(),
        stageName: Joi.string(),
        pinfl: Joi.string(),
        documentId: Joi.string(),
    });
    return schema.validate(data);
}

module.exports = { Progress, SubStage, validateProgress, validateSubStage };
