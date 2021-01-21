"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductListValidation = exports.RemoveProductValidation = exports.UpdateProductPublishValidation = exports.UpdateProductValidation = exports.CreateProductValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// POST /v1/auth/register
exports.CreateProductValidation = {
    body: {
        name: joi_1.default
            .string()
            .required(),
        title: joi_1.default.string()
            .required(),
        description: joi_1.default.string()
            .required(),
        price: joi_1.default.number()
            .min(1)
            .max(100000) // limit price to $100k
            .required(),
        published: joi_1.default.boolean()
    },
};
exports.UpdateProductValidation = exports.CreateProductValidation;
exports.UpdateProductPublishValidation = {
    body: {
        status: joi_1.default.boolean()
            .required()
    }
};
exports.RemoveProductValidation = {
    params: {
        productId: joi_1.default.string()
            .required()
    }
};
exports.ProductListValidation = {
    query: {
        searchText: joi_1.default.string(),
        limitTo: joi_1.default.number(),
        startAt: joi_1.default.number(),
    }
};
