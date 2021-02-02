import httpStatus from 'http-status'
import APIError from '../../../utils/APIError'

import {
  IUserRepositoryGateway
} from '../../entities/users'

import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{}
export class ValidateDuplicateEmailService {
  constructor (protected dependencies: IServiceDependencies) {
  }

  validateOne = async ({
    email = '',
    userId = ''
  }) => {
    try {
      const query = <any>{
        'email.value': email
      }
      // ignore the provided userId on finding duplicate email.
      // most likely will use on update function
      if (userId) {
        query._id = {
          $ne: userId
        }
      }
      // initiate user entity
      // add catch to handle the built in error on the findOne when no details found.
      const user = await this.dependencies.repositoryGateway.findOne(query).catch(() => null)
      if (user) {
        throw new APIError({
          message: 'Validation Error',
          errors: [{
            field: 'email',
            location: 'body',
            messages: ['"email" already exists'],
          }],
          status: httpStatus.CONFLICT,
          isPublic: true
        });
      }
      //add some logs
      return true
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}