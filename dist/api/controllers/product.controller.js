"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProductRoute = exports.updateProductPublishStatusRoute = exports.productDetailsRoute = exports.productListRoute = exports.updateProductRoute = exports.createProductRoute = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Products_1 = require("../service-configurations/Products");
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
exports.createProductRoute = async (req, res, next) => {
    try {
        const newProduct = await Products_1.createProduct()
            .createOne(req.body);
        res.status(http_status_1.default.CREATED)
            .json(http_response_1.successReponse(newProduct));
    }
    catch (error) {
        next(error);
    }
};
/**
 * @public
 * create a product
 * @requestParams
 *  @field -> productId: string
 * @requestBody
 *  @field: title: string
 *  @field: description: string
 *  @field: price: float
 *  @field: name: string
 */
exports.updateProductRoute = async (req, res, next) => {
    try {
        const { productId = '' } = req.params;
        const updatedProduct = await Products_1.updateProduct()
            .updateOne(productId, req.body);
        res.status(http_status_1.default.ACCEPTED)
            .json(http_response_1.successReponse(updatedProduct));
    }
    catch (error) {
        next(error);
    }
};
/**
 * @public
 * product list
 * @requestQuery
 *  @field -> searchText: string
 *  @field -> startAt: number
 *  @field -> limitTo: number
 */
exports.productListRoute = async (req, res, next) => {
    try {
        const { searchText = '', startAt = 0, limitTo = 0 } = req.query;
        const newProduct = await Products_1.productList()
            .getList({
            searchText,
            startAt,
            limitTo
        });
        res.status(http_status_1.default.OK)
            .json(http_response_1.successReponse(newProduct));
    }
    catch (error) {
        next(error);
    }
};
/**
 * @public
 * product list
 * @requestParams
 *  @field -> productId: string
 */
exports.productDetailsRoute = async (req, res, next) => {
    try {
        const { productId = '' } = req.params;
        const product = await Products_1.productDetails()
            .findOne(productId);
        res.status(http_status_1.default.OK)
            .json(http_response_1.successReponse(product));
    }
    catch (error) {
        next(error);
    }
};
/**
 * @public
 * product list
 * @requestParams
 *  @field -> productId: string
 */
exports.updateProductPublishStatusRoute = async (req, res, next) => {
    try {
        const { productId = '' } = req.params;
        const { status = true } = req.body;
        const product = await Products_1.updateProductPublishStatus()
            .updateOne(productId, status);
        res.status(http_status_1.default.ACCEPTED)
            .json(http_response_1.successReponse(product));
    }
    catch (error) {
        next(error);
    }
};
/**
 * @public
 * product list
 * @requestParams
 *  @field -> productId: string
 */
exports.removeProductRoute = async (req, res, next) => {
    try {
        const { productId = '' } = req.params;
        const product = await Products_1.removeProduct()
            .removeOne(productId);
        res.status(http_status_1.default.ACCEPTED)
            .json(http_response_1.successReponse(product));
    }
    catch (error) {
        next(error);
    }
};
