import supertest from 'supertest'
import faker from 'faker'
import {v4 as uuid} from 'uuid'
import {assert} from 'chai'

import App from '../../../../index'
const request = supertest(App)
import {userSignInResponse} from './sign-in.test'
import httpStatus from 'http-status'
import { ALLOWED_USER_ROLES } from '../../../domain/entities/users'
const userObj = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  role: 'user'
}

describe('@User API', () => {
  describe('@Details', () => {
    it('should success fetch user details', (done) => {
      request
        .get(`/v1/users/${userSignInResponse.user._id}`)
        .set('Authorization', `Bearer ${userSignInResponse.token}`)
        .expect(httpStatus.OK)
        .then((response) => {
          const {success = false, result} = response.body
          assert.isTrue(success)
          assert.isString(result._id)
          assert.isNotEmpty(result._id)
          assert.isString(result.name)
          assert.isNotEmpty(result.name)
          assert.isString(result.email.value)
          assert.isNotEmpty(result.email.value)
          assert.isString(result.role)
          assert.isNotEmpty(result.role)
          done()
        })
        .catch(done)
    })
    it('should failed fetch user details. random user id', (done) => {
      request
        .get(`/v1/users/${uuid()}`)
        .set('Authorization', `Bearer ${userSignInResponse.token}`)
        .expect(httpStatus.BAD_REQUEST)
        .then((response) => {
          const {success = false, result} = response.body
          assert.isFalse(success)
          done()
        })
        .catch(done)
    })
  })
  describe('@Update', () => {
    it('should success updating user', (done) => {
      request
        .patch(`/v1/users/${userSignInResponse.user._id}`)
        .set('Authorization', `Bearer ${userSignInResponse.token}`)
        .send(userObj)
        .expect(httpStatus.ACCEPTED)
        .then(({body}) => {
          const {success = false, result, errors} = body
          assert.isTrue(success)
          assert.isString(result._id)
          assert.isNotEmpty(result._id)
          assert.isString(result.name)
          assert.isNotEmpty(result.name)
          assert.isString(result.email.value)
          assert.isNotEmpty(result.email.value)
          assert.isString(result.role)
          assert.isNotEmpty(result.role)
          // check if role is on allowed users.
          assert.match(result.role, new RegExp(`^(${ALLOWED_USER_ROLES.join('|')})$`, 'i'))
          done()
        })
        .catch(done)
    })
    it('should failed updating user. invalid name', (done) => {
      request
        .patch(`/v1/users/${userSignInResponse.user._id}`)
        .set('Authorization', `Bearer ${userSignInResponse.token}`)
        .send({
          ...userObj,
          name: 'John iDoe2.0'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then(({body}) => {
          const {success = false, result, errors} = body
          assert.isFalse(success)
          done()
        })
        .catch(done)
    })
    it('should failed updating user. invalid email address', (done) => {
      request
        .patch(`/v1/users/${userSignInResponse.user._id}`)
        .set('Authorization', `Bearer ${userSignInResponse.token}`)
        .send({
          ...userObj,
          email: 'john@doe@gm.com.ph'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then(({body}) => {
          const {success = false, result, errors} = body
          assert.isFalse(success)
          done()
        })
        .catch(done)
    })
    it('should failed updating user. invalid user role', (done) => {
      request
        .patch(`/v1/users/${userSignInResponse.user._id}`)
        .set('Authorization', `Bearer ${userSignInResponse.token}`)
        .send({
          ...userObj,
          role: 'superman'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then(({body}) => {
          const {success = false, result, errors} = body
          assert.isFalse(success)
          done()
        })
        .catch(done)
    })
  })
})