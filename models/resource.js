const mongoose = require('mongoose');
const Joi = require('joi');

const resourceSchema = new mongoose.Schema({
    requestId: { type: String, required: true },
    coBorrower: { type: String, required: true },
    borrower: { type: String, required: true },
    params: {
        format: { type: String, required: true },
        duration: { type: String, required: true },
        depCode: { type: String, required: true },
        applicationDate: { type: String, required: true },
        clientCode: { type: String, required: true },
        downPayment: { type: Number, required: true },
        amount: { type: Number, required: true },
        gracePeriod: { type: Number, required: true },
        repaymentType: { type: String, required: true },
        paymentDate: { type: String, required: true },
        insuranceCode: { type: String, required: true },
        married: { type: Boolean, required: true },
        spousePinfl: { type: String, required: true },
        spousePhone: { type: String, required: true },
        clientRole: { type: String, default: "" },
        coborrowerPhoneNumber: { type: String, default: "" },
        transactionCards: [
            {
                cardNumber: { type: String, required: true },
                cardType: { type: String, required: true },
                expiryDate: { type: String, required: true }
            }
        ]
    }
});

const Resource = mongoose.model('Resource', resourceSchema);

function validateResources(resource) {
    const ResourceSchema = Joi.object({
        requestId: Joi.string().required(),
        coBorrower: Joi.string().required(),
        borrower: Joi.string().required(),
        params: Joi.object({
            format: Joi.string().required(),
            duration: Joi.string().required(),
            depCode: Joi.string().required(),
            applicationDate: Joi.string().required(),
            clientCode: Joi.string().required(),
            downPayment: Joi.number().required(),
            amount: Joi.number().required(),
            gracePeriod: Joi.number().required(),
            repaymentType: Joi.string().required(),
            paymentDate: Joi.string().required(),
            insuranceCode: Joi.string().required(),
            married: Joi.boolean().required(),
            spousePinfl: Joi.string().required(),
            spousePhone: Joi.string().required(),
            clientRole: Joi.string().allow(""),
            coborrowerPhoneNumber: Joi.string().allow(""),
            transactionCards: Joi.array().items(
                Joi.object({
                    cardNumber: Joi.string().required(),
                    cardType: Joi.string().required(),
                    expiryDate: Joi.string().required()
                })
            ).required()
        }).required()
    });

    return ResourceSchema.validate(resource);
}

exports.Resource = Resource;
exports.validate = validateResources;
