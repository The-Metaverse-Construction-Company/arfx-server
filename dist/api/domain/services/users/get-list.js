"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserListService = void 0;
// interface IPaginationListParams {
//   page: number
//   perPage: number,
//   name: string
//   email: string
//   role: string
// }
class UserListService {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.getList = async ({ pageNo = 1, limit = 10, searchText = '' }) => {
            try {
                const query = {
                    name: new RegExp(searchText, 'i'),
                    "email.value": new RegExp(searchText, 'i')
                };
                const list = await this.dependencies.repositoryGateway.findAll(query, { pageNo, limit }, {
                    password: 0
                });
                return list;
            }
            catch (error) {
                console.log('error :>> ', error);
                throw error;
            }
        };
    }
}
exports.UserListService = UserListService;
