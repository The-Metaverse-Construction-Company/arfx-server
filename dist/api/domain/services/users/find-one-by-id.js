"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../../models/user.model"));
exports.default = () => (async (userId, projection = {}) => {
    try {
        // initiate user entity to run the validation for business rules.
        const user = await user_model_1.default.findOne({
            _id: userId,
        }, projection);
        if (!user) {
            throw new Error('No User found.');
        }
        return user;
    }
    catch (error) {
        throw error;
    }
});
