"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const users_1 = __importDefault(require("./models/users"));
const General_Gateway_1 = __importDefault(require("./General.Gateway"));
class UserRepository extends General_Gateway_1.default {
    constructor() {
        super(users_1.default);
    }
}
exports.UserRepository = UserRepository;
