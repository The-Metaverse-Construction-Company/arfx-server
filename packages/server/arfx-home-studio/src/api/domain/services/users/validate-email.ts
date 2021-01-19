import httpStatus from 'http-status'
import UserModel from '../../../models/user.model'
import APIError from '../../../utils/APIError'

export default class ValidateDuplicateEmail {
  constructor () {
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
      const user = await UserModel.findOne(query)
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