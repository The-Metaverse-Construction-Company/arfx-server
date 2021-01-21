"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../../models/user.model"));
const constants_1 = require("../../../utils/constants");
class UserResetPassword {
    constructor(deps) {
        this.deps = deps;
        this.resetOne = async (email) => {
            try {
                // fetch user by email.
                const user = await user_model_1.default.findOne({
                    "email.value": email
                }, { password: 0 });
                if (!user) {
                    // just return false if no user.
                    return false;
                }
                // insert to repository.
                const token = await this.deps.generateToken({
                    referenceId: user._id,
                    tokenType: constants_1.TOKEN_TYPE.RESET_PASSWORD
                });
                // send forgot password email.
                await this.deps.sendEmail(user._id, token);
                //add some logs
                return token;
            }
            catch (error) {
                console.log('failed to send reset password. \nError:>> ', error);
                throw error;
            }
        };
    }
}
exports.default = UserResetPassword;
