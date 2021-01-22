"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifiedUserService = void 0;
const constants_1 = require("../../../utils/constants");
const entities_1 = require("../../entities");
class VerifiedUserService {
    constructor(deps) {
        this.deps = deps;
        this.updateOne = async (userId) => {
            try {
                //fetch user details
                const user = await this.deps.userDetails.findOne(userId, { password: 0 });
                // create account on stripe. 
                // reference: https://stripe.com/docs/api/customers
                const customerId = await this.deps.createPaymentGatewayAccount({
                    email: user.email.value,
                    name: user.name
                });
                console.log('customerId :>> ', customerId);
                // initiate user entity to validate the updated if allowed on the business rules.
                const validatedUser = new entities_1.UserEntity({
                    ...user,
                    email: {
                        value: user.email.value,
                        verified: true,
                        verifiedAt: Date.now()
                    },
                    stripeCustomerId: customerId
                });
                const updatedUser = await this.deps.repositoryGateway.updateOne({
                    _id: userId
                }, {
                    //@ts-expect-error
                    "email.verified": validatedUser.email.verified,
                    "email.verifiedAt": validatedUser.email.verifiedAt,
                    stripeCustomerId: validatedUser.stripeCustomerId
                });
                await this.deps.revokeToken(userId, constants_1.TOKEN_TYPE.SIGN_UP);
                // create stripe users
                //add some logs
                return updatedUser;
            }
            catch (error) {
                throw error;
            }
        };
    }
}
exports.VerifiedUserService = VerifiedUserService;
