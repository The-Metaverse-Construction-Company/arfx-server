"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseHistoryList = exports.purchaseHistoryDetails = exports.createPurchaseHistory = void 0;
const purchase_history_1 = require("../domain/services/purchase-history");
const repository_1 = require("../../app-plugins/persistence/repository");
exports.createPurchaseHistory = () => (new purchase_history_1.CreatePurchaseHistory({
    repositoryGateway: new repository_1.PurchaseHistoryRepository()
}));
exports.purchaseHistoryDetails = () => (new purchase_history_1.PurchaseHistoryDetails({
    repositoryGateway: new repository_1.PurchaseHistoryRepository()
}));
exports.purchaseHistoryList = () => (new purchase_history_1.PurchaseHistoryList({
    repositoryGateway: new repository_1.PurchaseHistoryRepository()
}));
