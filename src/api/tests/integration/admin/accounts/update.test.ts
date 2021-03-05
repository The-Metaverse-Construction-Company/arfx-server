/**
 * @lib
 */
import supertest from 'supertest'
import {assert, expect} from 'chai'
import faker from 'faker'
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
describe('@Sign-Up Admin Account Service', () => {
  it('should success updating admin account.', (done) => {
     http
      .patch(`/v1/admin-accounts/${adminSignUpResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send(adminSignUpObjc)
      .expect(httpStatus.ACCEPTED)
      .then((data) => {
        const {success, result} = data.body
        assert.isTrue(success)
        done()
      })
      .catch(done)
  })
  it('should failed updating admin account due to duplicate email address.', (done) => {
     http
      .patch(`/v1/admin-accounts/${adminSignUpResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send(adminSignUpObjc)
      .expect(httpStatus.BAD_REQUEST)
      .then((data) => {
        const {success, result} = data.body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
  it('should failed updating admin account due to invalid email format.', (done) => {
     http
      .patch(`/v1/admin-accounts/${adminSignUpResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        ...adminSignUpObjc,
        firstName: 'dev@0001@mailnesia.com'
      })
      .expect(httpStatus.BAD_REQUEST)
      .then((data) => {
        const {success, result} = data.body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
  it('should failed updating admin account due to first name with numeric.', (done) => {
     http
      .patch(`/v1/admin-accounts/${adminSignUpResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        ...adminSignUpObjc,
        firstName: 'juan test123'
      })
      .expect(httpStatus.BAD_REQUEST)
      .then((data) => {
        const {success, result} = data.body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
  it('should failed updating admin account due to last name with numeric.', (done) => {
     http
      .patch(`/v1/admin-accounts/${adminSignUpResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        ...adminSignUpObjc,
        lastName: 'juan test123'
      })
      .expect(httpStatus.BAD_REQUEST)
      .then((data) => {
        const {success, result} = data.body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
  it('should failed updating admin account due to invalid role level.', (done) => {
     http
      .patch(`/v1/admin-accounts/${adminSignUpResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .send({
        ...adminSignUpObjc,
        roleLevel: 15
      })
      .expect(httpStatus.BAD_REQUEST)
      .then((data) => {
        const {success, result} = data.body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
})