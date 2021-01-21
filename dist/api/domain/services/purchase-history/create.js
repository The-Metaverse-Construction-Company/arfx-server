"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePurchaseHistory = void 0;
const entities_1 = require("../../entities");
class CreatePurchaseHistory {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    /**
     * create purchase history
     * @param productBody
     */
    createOne(purchaseBody) {
        try {
            const newProductEntity = new entities_1.PurchaseHistoryEntity(purchaseBody);
            // insert it thru the repo.
            // this.dependencies.repositoryGateway.insertOne(newProductEntity)
            // add logs
            return newProductEntity;
        }
        catch (error) {
            console.log('failed to create product. \nError :>> ', error);
            throw error;
        }
    }
}
exports.CreatePurchaseHistory = CreatePurchaseHistory;
