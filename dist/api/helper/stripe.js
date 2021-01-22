"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const constants_1 = require("../utils/constants");
// initiate Stripe API
exports.default = new stripe_1.default(constants_1.STRIPE_SECRET_KEY, { typescript: true, apiVersion: "2020-08-27" });
