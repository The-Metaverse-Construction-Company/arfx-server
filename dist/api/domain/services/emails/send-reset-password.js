"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../../models/user.model"));
const constants_1 = require("../../../utils/constants");
class SendResetPassword {
    constructor(deps) {
        this.deps = deps;
        this.sendOne = async (userId, token) => {
            try {
                // initiate user entity to run the validation for business rules.
                // insert to repository.
                const user = await user_model_1.default.findOne({ _id: userId });
                // if the email is already verified, then skip sending email.
                if (user) {
                    this.deps.sendEmail({
                        name: user.name,
                        token,
                        email: user.email.value,
                        url: `${constants_1.CLIENT_HOST}/ui/reset-password?token${token}&tokenType=${constants_1.TOKEN_TYPE.RESET_PASSWORD}`
                    });
                }
                //add some logs
                return true;
            }
            catch (error) {
                console.log('Failed to send reset password email. \nError: ', error);
                throw error;
            }
        };
    }
}
exports.default = SendResetPassword;
