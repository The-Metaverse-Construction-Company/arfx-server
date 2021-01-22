"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseHistoryList = exports.purchaseHistoryDetails = exports.purchaseProductService = void 0;
const payment_gateway_1 = __importDefault(require("../../config/payment-gateway"));
const purchase_history_1 = require("../domain/services/purchase-history");
const Products_1 = require("./Products");
const users_1 = require("./users");
const repository_1 = require("../../app-plugins/persistence/repository");
exports.purchaseProductService = () => (new purchase_history_1.PurchaseProductService({
    repositoryGateway: new repository_1.PurchaseHistoryRepository(),
    productDetailsService: Products_1.productDetails(),
    userDetailsService: users_1.userDetails(),
    chargeCustomer: payment_gateway_1.default.customer.charge,
    setupCustomerPaymentIntent: payment_gateway_1.default.customer.setupIntents
}));
exports.purchaseHistoryDetails = () => (new purchase_history_1.PurchaseHistoryDetails({
    repositoryGateway: new repository_1.PurchaseHistoryRepository()
}));
exports.purchaseHistoryList = () => (new purchase_history_1.PurchaseHistoryList({
    repositoryGateway: new repository_1.PurchaseHistoryRepository()
}));
