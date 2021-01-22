"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Interfaces"), exports);
__exportStar(require("./RepositoryGatewayInterfaces"), exports);
exports.default = ({ generateId }) => (class ProductEntity {
    constructor({ productId = '', amount = 0, paymentMethodId = '', userId = '', paymentIntentId = '' }) {
        amount = parseFloat(amount);
        if (isNaN(amount)) {
            throw new Error('Amount must be a numeric with 2 decimal places.');
        }
        else if (amount <= 0) {
            throw new Error('Amount must be greater than 0.');
        }
        // if (discountPercentage < 0) {
        //   throw new Error('discountPercentage must be greater than 0.')
        // }
        if (!productId) {
            throw new Error('productId must not be null, undefined or empty string.');
        }
        if (!paymentMethodId) {
            throw new Error('paymentMethodId must not be null, undefined or empty string.');
        }
        if (!userId) {
            throw new Error('userId must not be null, undefined or empty string.');
        }
        // add additional business rules here if needed.
        this._id = generateId();
        this.productId = productId;
        this.paymentMethodId = paymentMethodId;
        this.paymentIntentId = paymentIntentId;
        this.userId = userId;
        this.amount = amount;
        // this.discountPercentage = discountPercentage
        this.purchasedAt = Date.now();
        this.updatedAt = Date.now();
        this.createdAt = Date.now();
    }
});
