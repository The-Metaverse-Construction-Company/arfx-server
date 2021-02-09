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

const http = supertest(App)

export const adminSignUpObjc = {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: 'asdasd123123',
  roleLevel: 1
}
export let adminSignUpResponse = <IAdminAccountsEntity>{}
describe('@Sign-Up Admin Account Service', () => {
  it('should success creating admin account.', (done) => {
     http
      .post('/v1/admin-accounts')
      .send(adminSignUpObjc)
      .expect(httpStatus.CREATED)
      .then((data) => {
        const {success, result} = data.body
        adminSignUpResponse = result.admin
        assert.equal(success, true)
        done()
      })
      .catch(done)
  })
  it('should failed creating admin account due to duplicate email address.', (done) => {
    http
      .post('/v1/admin-accounts')
      .send(adminSignUpObjc)
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success, result, errors = []} = body
        assert.isNotOk(success)
        assert.isAbove(errors.length, 0)
        done()
      })
      .catch(done)
  })

  it('should failed updating admin account due to invalid email format.', (done) => {
    http
      .post('/v1/admin-accounts')
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
     .post('/v1/admin-accounts')
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
     .post('/v1/admin-accounts')
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
     .post('/v1/admin-accounts')
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