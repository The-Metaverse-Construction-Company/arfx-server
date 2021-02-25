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

const http = supertest(App)

export const signInObjc = {
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: 'asdasd123123',
  mobileNumber: faker.phone.phoneNumber('+639##########')
}

describe('@Signup Service', () => {
  let signUpResponse = <any>{}
  it('Sign-Up User', (done) => {
     http
      .post('/v1/auth/sign-up')
      .send(signInObjc)
      .expect(httpStatus.CREATED)
      .then((data) => {
        const {success, result} = data.body
        signUpResponse = result
        assert.equal(success, true)
        done()
      })
  })
  it('should failed. Duplicate Email, ', (done) => {
    http
      .post('/v1/auth/sign-up')
      .send(signInObjc)
      .expect(httpStatus.BAD_REQUEST)
      .then((data) => {
        const {success, result} = data.body
        assert.isOk(false, 'should not success.')
        done(true)
      })
      .catch((err) => {
        assert.isOk(true)
        done()
      })
  })
  it('should verify the user', (done) => {
    http
      .get(`/v1/auth/sign-up/verify`)
      .query({
        token: signUpResponse.token
      })
      .expect(httpStatus.OK)
      .then((data) => {
        const {success, result} = data.body
        assert.isOk(true)
        done()
      })
      .catch(done)
  })
  it('should failed. invalid token for verify user', (done) => {
    http
      .get(`/v1/auth/sign-up/verify`)
      .query({token: signUpResponse.token})
      .expect(httpStatus.BAD_REQUEST)
      .then(({body, status}) => {
        const {success} = body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
})