/**
 * @lib
 */
import supertest from 'supertest'
import {assert, expect} from 'chai'
import faker from 'faker'
import {v4 as uuid} from 'uuid'
import httpStatus from 'http-status'
/**
 * @main_App
 */
import App from '../../../../../index'
import { IAdminAccountsEntity } from '../../../../domain/entities/admin-accounts'
import {adminSignUpResponse} from './create.test'
import {adminSignInResponse} from '../auth.test'
const http = supertest(App)

export const adminSignUpObjc = {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: 'asdasd123123',
  roleLevel: 1
}
describe('@Get Admin Account Details API', () => {
  it('should success fetching admin account details.', (done) => {
     http
      .get(`/v1/admin-accounts/${adminSignUpResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .expect(httpStatus.OK)
      .then((data) => {
        const {success, result} = data.body
        assert.isTrue(success)
        done()
      })
      .catch(done)
  })
  it('should failed fetching admin account due to invalid admin account.', (done) => {
     http
      .get(`/v1/admin-accounts/${uuid()}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .expect(httpStatus.BAD_REQUEST)
      .then((data) => {
        const {success, result} = data.body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
})