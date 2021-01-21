"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const product_model_1 = __importDefault(require("./models/product.model"));
const General_Gateway_1 = __importDefault(require("./General.Gateway"));
class ProductRepository extends General_Gateway_1.default {
    constructor() {
        super(product_model_1.default);
    }
}
exports.ProductRepository = ProductRepository;
