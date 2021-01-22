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
        this.purchaseOne = async (userId, purchaseBody) => {
            try {
                console.log('purchaseBody :>> ', purchaseBody);
                // fetch user data.
                const user = await this.dependencies.userDetailsService.findOne(userId);
                // fetch product data.
                const product = await this.dependencies.productDetailsService.findOne(purchaseBody.productId);
                // initialize purchase entity
                const newPurchaseHistory = new entities_1.PurchaseHistoryEntity({
                    ...purchaseBody,
                    amount: product.price,
                    paymentMethodId: purchaseBody.paymentMethodId,
                    userId: user._id,
                });
                let intentSecret = null;
                // if keepCardDetails is true, then create a card setup intent
                if (purchaseBody.keepCardDetails) {
                    intentSecret = await this.dependencies.setupCustomerPaymentIntent(user.stripeCustomerId);
                }
                console.log('newPurchaseHistory :>> ', newPurchaseHistory);
                // charge customer,
                const { authenticated, paymentIntent } = await this.dependencies.chargeCustomer({
                    amount: newPurchaseHistory.amount,
                    customerId: user.stripeCustomerId,
                    paymentMethodId: newPurchaseHistory.paymentMethodId
                });
                newPurchaseHistory.paymentIntentId = paymentIntent.id;
                // newPurchaseHistory
                // insert it thru the repo.
                await this.dependencies.repositoryGateway.insertOne(newPurchaseHistory);
                // add logs
                return {
                    authenticated: authenticated,
                    payment: paymentIntent,
                    purchaseDetails: newPurchaseHistory,
                    intentSecret
                };
            }
            catch (error) {
                console.log('failed to create product. \nError :>> ', error);
                throw error;
            }
        };
    }
}
exports.PurchaseProductService = PurchaseProductService;
