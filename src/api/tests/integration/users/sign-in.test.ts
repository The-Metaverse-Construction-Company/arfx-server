/**
 * @lib
 */
import httpStatus from 'http-status'
import supertest from 'supertest'
import {assert} from 'chai'
import faker from 'faker'

import App from '../../../../index'
import { IUserEntity } from '../../../domain/entities/users'
import {signInObjc} from './sign-up.test'
const request = supertest(App)
export let userSignInResponse = <{token: string, user: IUserEntity}>{}
describe('@SignIn API', () => {
  it('should sign-in successfully', (done) => {
    request
      .post('/v1/auth/login')
      .send({
        username: signInObjc.email,
        password: signInObjc.password
      })
      .expect(httpStatus.OK)
      .then((response) => {
        const {success = false, result} = response.body
        assert.isOk(success)
        assert.notEqual(result.user._id, '')
        assert.notEqual(result.token, '')
        userSignInResponse = result
        done()
      })
      .catch(done)
  })
  it('should sign-in failed due to incorrect email credentials.', (done) => {
    request
      .post('/v1/auth/login')
      .send({
        username: faker.internet.email(),
        password: signInObjc.password
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body, status}) => {
        const {success = false, result, errors} = body
        assert.equal(success, false)
        assert.equal(result, null)
        assert.equal(errors[0], 'Invalid user credentials.')
        done()
      })
      .catch(done)
  })
  it('should sign-in failed due to incorrect password credentials.', (done) => {
    request
      .post('/v1/auth/login')
      .send({
        username: signInObjc.email,
        password: faker.internet.password(6)
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body, status}) => {
        const {success = false, result, errors} = body
        assert.equal(success, false)
        assert.equal(result, null)
        assert.equal(errors[0], 'Invalid user credentials.')
        done()
      })
      .catch(done)
  })
  it('should sign-in failed due to incorrect username and password credentials.', (done) => {
    request
      .post('/v1/auth/login')
      .send({
        username: faker.internet.email(),
        password: faker.internet.password(6)
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body, status}) => {
        const {success = false, result, errors} = body
        assert.equal(success, false)
        assert.equal(result, null)
        assert.equal(errors[0], 'Invalid user credentials.')
        done()
      })
      .catch(done)
  })
})