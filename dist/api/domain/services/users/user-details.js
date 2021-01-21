"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetailsService = void 0;
class UserDetailsService {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.findOne = async (userId, projection = {}) => {
            try {
                // initiate user entity to run the validation for business rules.
                const user = await this.dependencies.repositoryGateway.findOne({
                    _id: userId,
                }, projection);
                if (!user) {
                    throw new Error('No User found.');
                }
                return user;
            }
            catch (error) {
                throw error;
            }
        };
    }
}
exports.UserDetailsService = UserDetailsService;
