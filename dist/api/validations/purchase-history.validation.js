"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// POST /v1/auth/register
exports.PurchaseValidation = {
    body: {
        paymentMethodId: joi_1.default
            .string()
            .required(),
        productId: joi_1.default
            .string()
            .required(),
        keepCardDetails: joi_1.default
            .boolean()
            .required(),
    },
};
