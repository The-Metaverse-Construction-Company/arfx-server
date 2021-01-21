"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendResetPasswordService = void 0;
const constants_1 = require("../../../utils/constants");
class SendResetPasswordService {
    constructor(deps) {
        this.deps = deps;
        this.sendOne = async (userId, token) => {
            try {
                // initiate user entity to run the validation for business rules.
                // insert to repository.
                const user = await this.deps.repositoryGateway.findOne({ _id: userId });
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
exports.SendResetPasswordService = SendResetPasswordService;
