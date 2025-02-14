const mongoose = require('mongoose');
const Joi = require('joi');

// Define the schema for tracking request progress status
const StatusSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ['getDocument', 'signDocument', 'completed'], // Allowed statuses
        default: 'getDocument'
    }
});

// Create a model for tracking status
const Status = mongoose.model('Status', StatusSchema);

// Joi validation for request status
function validateStatus(data) {
    const schema = Joi.object({
        requestId: Joi.string().required(),
        status: Joi.string().valid('getDocument', 'signDocument', "refusalBank", 'completed').required()
    });

    return schema.validate(data);
}

// Export the model and validation function
exports.Status = Status;
exports.validate = validateStatus;
