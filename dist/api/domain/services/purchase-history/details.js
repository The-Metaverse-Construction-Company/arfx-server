"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseHistoryDetails = void 0;
class PurchaseHistoryDetails {
    constructor(dependencies) {
        this.dependencies = dependencies;
        /**
         * find purchase history details
         * @param productBody
         */
        this.findOne = async (purchaseHistoryId) => {
            try {
                // get list in the repo
                const purchaseHistory = await this.dependencies.repositoryGateway.findOne({
                    _id: purchaseHistoryId
                });
                return purchaseHistory;
            }
            catch (error) {
                console.log('failed to find purchase history details. \nError :>> ', error);
                throw error;
            }
        };
    }
}
exports.PurchaseHistoryDetails = PurchaseHistoryDetails;
