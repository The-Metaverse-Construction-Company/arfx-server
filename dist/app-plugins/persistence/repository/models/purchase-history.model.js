"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// this will automatically error when it have a changes on the purchase history entity interface
const RepositoryModel = {
    _id: {
        type: String,
        default: '',
    },
    productId: {
        type: String,
        default: '',
    },
    paymentMethodId: {
        type: String,
        default: 0,
    },
    amount: {
        type: Number,
        default: 0
    },
    discountPercentage: {
        type: String,
        default: 0
    },
    purchasedAt: {
        type: Number,
        default: 0
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
