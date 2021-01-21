"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../../models/user.model"));
const constants_1 = require("../../../utils/constants");
class UserSignIn {
    constructor(deps) {
        this.deps = deps;
        this.signIn = async ({ username = '', password = '', }) => {
            try {
                // initiate user entity to run the validation for business rules.
                const user = await user_model_1.default.findOne({
                    "email.value": username
                })
                    .sort({
                    createdAt: 1
                });
                if (!user || !(this.deps.comparePassword(password, user.password))) {
                    throw new Error('Invalid credentials.');
                }
                else if (!user.email.verified) {
                    throw new Error('Account not yet verified, Please verified your account first.');
                }
                const token = await this.deps.generateToken({
                    referenceId: user._id,
                    tokenType: constants_1.TOKEN_TYPE.SIGN_IN
                });
                // add some logs or notification.
                return {
                    user: user,
                    token
                };
            }
            catch (error) {
                console.log('error :>> ', error);
                throw error;
            }
        };
    }
}
exports.default = UserSignIn;
