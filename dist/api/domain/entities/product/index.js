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
__exportStar(require("./interfaces"), exports);
__exportStar(require("./RepositoryGatewayInterfaces"), exports);
exports.default = ({ generateId }) => (class ProductEntity {
    constructor({ _id = '', name = '', description = '', price = 0, discountPercentage = 0, sceneURL = '', title = '', published = false, 
    // stripeCustomerId = '',
    updatedAt = Date.now(), createdAt = Date.now() }) {
        this.published = false;
        price = parseFloat(price);
        price = parseFloat(discountPercentage);
        if (!_id) {
            _id = generateId();
        }
        if (price <= 0) {
            throw new Error('Price must be larger than 0.');
        }
        if (discountPercentage < 0) {
            throw new Error('discountPercentage must be larger than 0.');
        }
        if (!title) {
            throw new Error('title must not be null, undefined or empty string.');
        }
        else if (title.length >= 3) {
            throw new Error('title must atleast 3 characters.');
        }
        if (!description) {
            throw new Error('description must not be null, undefined or empty string.');
        }
        // add additional business rules here if needed.
        this._id = _id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.discountPercentage = discountPercentage;
        this.sceneURL = sceneURL;
        this.title = title;
        this.published = published;
        // this.stripeCustomerId = stripeCustomerId
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }
});
