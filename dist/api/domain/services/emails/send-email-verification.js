"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmailVerificationService = void 0;
const constants_1 = require("../../../utils/constants");
class SendEmailVerificationService {
    constructor(deps) {
        this.deps = deps;
        this.sendOne = async (userId, token) => {
            try {
                // initiate user entity to run the validation for business rules.
                // insert to repository.
                const user = await this.deps.repositoryGateway.findOne({ _id: userId });
                // if the email is already verified, then skip sending email.
                if (user && !user.email.verified) {
                    this.deps.sendEmail({
                        name: user.name,
                        token,
                        email: user.email.value,
                        url: `${constants_1.CLIENT_HOST}/ui/verification?token${token}&tokenType=${constants_1.TOKEN_TYPE.SIGN_UP}`
                    });
                }
                //add some logs
                return true;
            }
            catch (error) {
                console.log('error :>> ', error);
                throw error;
            }
        };
    }
}
exports.SendEmailVerificationService = SendEmailVerificationService;
