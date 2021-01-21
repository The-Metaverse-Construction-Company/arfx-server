"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResetPasswordService = void 0;
const constants_1 = require("../../../utils/constants");
class UserResetPasswordService {
    constructor(deps) {
        this.deps = deps;
        this.resetOne = async (email) => {
            try {
                // fetch user by email.
                const user = await this.deps.repositoryGateway.findOne({
                    //@ts-expect-error
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
exports.UserResetPasswordService = UserResetPasswordService;
