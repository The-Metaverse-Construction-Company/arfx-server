"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// this will automatically error when it have a changes on the product entity interface
const RepositoryModel = {
    _id: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        default: '',
    },
    sceneURL: {
        type: String,
        default: '',
    },
    published: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0,
    },
    discountPercentage: {
        type: Number,
        default: 0,
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
exports.default = mongoose_1.model('products', RepositorySchema);
