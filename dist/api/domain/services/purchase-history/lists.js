"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseHistoryList = void 0;
class PurchaseHistoryList {
    constructor(dependencies) {
        this.dependencies = dependencies;
        /**
         * get purchase history lists
         * @param queryParams
         */
        this.getList = async (queryParams) => {
            try {
                // get list in the repo
                const purchaseHistoryList = await this.dependencies.repositoryGateway.findAll();
                return purchaseHistoryList;
            }
            catch (error) {
                console.log('failed to create product. \nError :>> ', error);
                throw error;
            }
        };
    }
}
exports.PurchaseHistoryList = PurchaseHistoryList;
