"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseProductRoute = void 0;
const http_status_1 = __importDefault(require("http-status"));
const PurchaseHistory_1 = require("../service-configurations/PurchaseHistory");
const http_response_1 = require("../helper/http-response");
/**
 * @public
 * create a product
 * @requestBody
 *  @field: title: string
 *  @field: description: string
 *  @field: price: float
 *  @field: name: string
 */
exports.purchaseProductRoute = async (req, res, next) => {
    try {
        const { _id = '' } = req.user;
        const newPurchaseHistory = await PurchaseHistory_1.purchaseProductService()
            .purchaseOne(_id, req.body);
        res.status(http_status_1.default.CREATED)
            .json(http_response_1.successReponse(newPurchaseHistory));
    }
    catch (error) {
        next(error);
    }
};
