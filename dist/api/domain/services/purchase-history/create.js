"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseProductService = void 0;
const entities_1 = require("../../entities");
class PurchaseProductService {
    constructor(dependencies) {
        this.dependencies = dependencies;
        /**
         * create purchase history
         * @param productBody
         */
        this.purchaseOne = async (userId, purchaseBody, stripeCustomerId) => {
            try {
                console.log('purchaseBody :>> ', purchaseBody);
                const product = await this.dependencies.productDetailsService.findOne(purchaseBody.productId);
                // initialize purchase entity
                const newPurchaseHistory = new entities_1.PurchaseHistoryEntity({
                    ...purchaseBody,
                    amount: product.price,
                    paymentMethodId: purchaseBody.paymentMethodId,
                    userId,
                });
                console.log('newPurchaseHistory :>> ', newPurchaseHistory);
                // charge customer,
                const paymentResponse = await this.dependencies.chargeCustomer({
                    amount: newPurchaseHistory.amount,
                    customerId: stripeCustomerId,
                    paymentMethodId: newPurchaseHistory.paymentMethodId
                });
                console.log('paymentResponse :>> ', paymentResponse);
                newPurchaseHistory.paymentIntentId = paymentResponse.id;
                // newPurchaseHistory
                // insert it thru the repo.
                await this.dependencies.repositoryGateway.insertOne(newPurchaseHistory);
                // add logs
                return newPurchaseHistory;
            }
            catch (error) {
                console.log('failed to create product. \nError :>> ', error);
                throw error;
            }
        };
    }
}
exports.PurchaseProductService = PurchaseProductService;
