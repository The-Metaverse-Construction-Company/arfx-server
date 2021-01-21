"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../../models/user.model"));
exports.default = () => (async ({ page = 1, perPage = 30, name = '', email = '', role }) => {
    try {
        const query = {
            name: new RegExp(name, 'i'),
            "email.value": new RegExp(email, 'i')
        };
        const list = await user_model_1.default.find(query, {
            password: 0
        })
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
        return list;
    }
    catch (error) {
        console.log('error :>> ', error);
        throw error;
    }
});
