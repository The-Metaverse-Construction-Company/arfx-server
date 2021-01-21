"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../entities");
const constants_1 = require("../../../utils/constants");
class UserSignUp {
    constructor(deps) {
        this.deps = deps;
        this.createOne = async ({ email = '', name = '', password = '', role = '' }) => {
            try {
                // initiate user entity to run the validation for business rules.
                const newUser = new entities_1.UserEntity({
                    email: {
                        value: email,
                        verifiedAt: 0,
                        verified: false
                    },
                    name,
                    password,
                    role,
                });
                // check duplicate email.
                await this.deps.validateEmail({ email: newUser.email.value });
                // insert to repository.
                await this.deps.repositoryGateway.insertOne(newUser);
                const token = await this.deps.generateToken({
                    referenceId: newUser._id,
                    tokenType: constants_1.TOKEN_TYPE.SIGN_UP
                });
                // send email notifications
                await this.deps.sendEmail(newUser._id, token);
                //add some logs
                return {
                    user: newUser,
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
exports.default = UserSignUp;
