"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../utils/constants");
class UserSignIn {
    constructor(deps) {
        this.deps = deps;
        this.signIn = async ({ username = '', password = '', }) => {
            try {
                // initiate user entity to run the validation for business rules.
                const user = await this.deps.repositoryGateway.findOne({
                    //@ts-expect-error
                    "email.value": username
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
