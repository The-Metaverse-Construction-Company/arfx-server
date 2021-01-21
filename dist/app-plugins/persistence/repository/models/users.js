"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// this will automatically error when it have a changes on the purchase history entity interface
const RepositoryModel = {
    _id: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
        required: true
    },
    email: {
        value: {
            type: String,
            default: '',
            required: true
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verifiedAt: {
            type: Number,
            default: 0
        }
    },
    mobileNumber: {
        value: {
            type: String,
            default: '',
            required: true
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verifiedAt: {
            type: Number,
            default: 0
        }
    },
    stripeCustomerId: {
        type: String,
        default: '',
        required: true
    },
    password: {
        type: String,
        default: '',
        required: true
    },
    role: {
        type: String,
        default: '',
        required: true
    },
    service: {
        facebook: {
            type: String,
            default: '',
            required: true
        },
        google: {
            type: String,
            default: '',
            required: true
        },
    },
    createdAt: {
        type: Number,
        default: 0,
    },
    updatedAt: {
        type: Number,
        default: 0,
    },
};
const RepositorySchema = new mongoose_1.Schema(RepositoryModel);
exports.default = mongoose_1.model('purchase_histories', RepositorySchema);
