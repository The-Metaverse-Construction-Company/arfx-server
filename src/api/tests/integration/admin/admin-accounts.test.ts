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
import { IAdminAccountsEntity } from '../../../domain/entities/admin-accounts'

const http = supertest(App)

export const adminSignUpObjc = {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: 'asdasd123123',
  roleLevel: 1
}
export let adminSignUpResponse = <{admin: IAdminAccountsEntity}>{}
describe('@Sign-Up Admin Account Service', () => {
  it('should success creating admin account.', (done) => {
     http
      .post('/v1/admin-accounts')
      .send(adminSignUpObjc)
      .expect(httpStatus.CREATED)
      .then((data) => {
        const {success, result} = data.body
        adminSignUpResponse = result
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
})