import supertest from 'supertest'
import {v4 as uuid} from 'uuid'
import {assert} from 'chai'

import App from '../../../../index'
const request = supertest(App)
import {userSignInResponse} from './sign-in.test'
import httpStatus from 'http-status'
describe('@User Product API', () => {
  describe('@Lists', () => {
    it('should success fetch product list', (done) => {
      request
        .get(`/v1/users/${userSignInResponse.user._id}/products`)
        .set('Authorization', `Bearer ${userSignInResponse.token}`)
        .expect(httpStatus.OK)
        .then((response) => {
          const {success = false, result} = response.body
          assert.isOk(success)
          assert.isNumber(result.pages)
          assert.isNumber(result.total)
          assert.isArray(result.data)
          done()
        })
        .catch(done)
    })
    it('should success fetch product list with pagination query filter.', (done) => {
      request
        .get(`/v1/users/${userSignInResponse.user._id}/products`)
        .set('Authorization', `Bearer ${userSignInResponse.token}`)
        .query({limit: 20, pageNo: 1})
        .expect(httpStatus.OK)
        .then((response) => {
          const {success = false, result} = response.body
          assert.isOk(success)
          assert.isNumber(result.pages)
          assert.isNumber(result.total)
          assert.isArray(result.data)
          done()
        })
        .catch(done)
    })
    it('should failed fetch user products list. random user id', (done) => {
      request
        .get(`/v1/users/${uuid()}/products`)
        .set('Authorization', `Bearer ${userSignInResponse.token}`)
        .query({
          limit: 20, 
          pageNo: -100
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((response) => {
          const {success = false, result, errors} = response.body
          assert.isFalse(success)
          assert.isAbove(errors.length, 0)
          done()
        })
        .catch(done)
    })
    it('should failed fetch user products list with negative value of pageNo for pagination query filter.', (done) => {
      request
        .get(`/v1/users/${userSignInResponse.user._id}/products`)
        .set('Authorization', `Bearer ${userSignInResponse.token}`)
        .query({
          limit: 20, 
          pageNo: -100
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((response) => {
          const {success = false, result, errors} = response.body
          assert.isFalse(success)
          assert.isAbove(errors.length, 0)
          done()
        })
        .catch(done)
    })
    it('should failed fetch user products list with negative value of limit for pagination query filter.', (done) => {
      request
        .get(`/v1/users/${userSignInResponse.user._id}/products`)
        .set('Authorization', `Bearer ${userSignInResponse.token}`)
        .query({limit: -20, pageNo: 1})
        .expect(httpStatus.BAD_REQUEST)
        .then((response) => {
          const {success = false, result, errors} = response.body
          assert.isFalse(success)
          assert.isAbove(errors.length, 0)
          done()
        })
        .catch(done)
    })
    it('should fetch user products list failed due to no authorization key.', (done) => {
      request
        .get(`/v1/users/${userSignInResponse.user._id}/products`)
        .expect(httpStatus.UNAUTHORIZED)
        .then(({body}) => {
          const {success = false, result} = body
          assert.isFalse(success)
          done()
        })
        .catch(done)
    })
  })
  describe('@Details', () => {
    // it('should success fetch product list', (done) => {
    //   request
    //     .get(`/v1/users/${userSignInResponse.user._id}/products/${}`)
    //     .set('Authorization', `Bearer ${userSignInResponse.token}`)
    //     .expect(httpStatus.OK)
    //     .then((response) => {
    //       const {success = false, result} = response.body
    //       assert.isOk(success)
    //       assert.isNumber(result.pages)
    //       assert.isNumber(result.total)
    //       assert.isArray(result.data)
    //       done()
    //     })
    //     .catch(done)
    // })
    it('should failed fetch user product details', (done) => {
      request
        .get(`/v1/users/${userSignInResponse.user._id}/products/${uuid()}`)
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
})