"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductRoute = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Products_1 = require("../service-configurations/Products");
const http_response_1 = require("../helper/http-response");
/**
 * @public
 * create a product
 * @body
 *  @field: title: string
 *  @field: description: string
 *  @field: price: float
 *  @field: name: string
 */
exports.createProductRoute = async (req, res, next) => {
    try {
        const newProduct = Products_1.createProduct()
            .createOne(req.body);
        res.status(http_status_1.default.CREATED)
            .json(http_response_1.successReponse(newProduct));
    }
    catch (error) {
        next(error);
    }
};
