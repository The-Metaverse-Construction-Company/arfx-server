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
import App from '../../../../index'
import {adminSignUpResponse} from './admin-accounts.test'
import { IAdminAccountsEntity } from '../../../domain/entities/admin-accounts'
const http = supertest(App)
export let adminSignInResponse = <{token: string, admin: IAdminAccountsEntity}>{}
const adminPassword = `asdasd123123`
describe('@Sign In Admin Account Service', () => {
  it('should success signing in admin account', (done) => {
     http
      .post('/v1/admin-accounts/auth/sign-in')
      .send({
        username: adminSignUpResponse.admin.email.value,
        password: adminPassword
      })
      .expect(httpStatus.CREATED)
      .then((data) => {
        const {success, result} = data.body
        adminSignInResponse = result
        assert.equal(success, true)
        done()
      })
      .catch(done)
  })
  it('should failed signing in admin account due to invalid email credential', (done) => {
    http
      .post('/v1/admin-accounts/auth/sign-in')
      .send({
        username: adminSignUpResponse.admin.email.value + 'x',
        password: adminPassword,
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success, result, errors = []} = body
        assert.isNotOk(success)
        assert.isAbove(errors.length, 0)
        done()
      })
      .catch(done)
  })
  it('should failed signing in admin account due to invalid password credential', (done) => {
    http
      .post('/v1/admin-accounts/auth/sign-in')
      .send({
        username: adminSignUpResponse.admin.email.value,
        password: adminPassword + 'x',
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success, result, errors = []} = body
        assert.isNotOk(success)
        assert.isAbove(errors.length, 0)
        done()
      })
      .catch(done)
  })
})