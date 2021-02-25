import supertest from 'supertest'
import {v4 as uuid} from 'uuid'
import {assert} from 'chai'

import App from '../../../../index'
const request = supertest(App)
import {userSignInResponse} from './sign-in.test'
import httpStatus from 'http-status'
import {addedProductResponse} from '../admin/products/create.test'
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
    //       assert.isTrue(success)
    //       assert.isString(result._id, 'product _id must be a string')
    //       assert.isString(result.name, 'product name must be a string')
    //       assert.isString(result.title, 'product title must be a string')
    //       assert.isString(result.description, 'product description must be a string')
    //       assert.isNumber(result.price, 'product price must be a numeric.')
    //       assert.isAbove(result.price, 0, 'product price must be not be lower than 0.')
    //       assert.isAbove(result.discountPercentage, -1, 'product discountPercentage must be not be lower than 0.')
    //       assert.isBoolean(result.published, 'product published must be boolean.')
    //       assert.isUndefined(result.contentZip, 'result.contentZip must not be defined.')
    //       assert.isUndefined(result.previewImage.originalFilePath, 'result.previewImage.originalFilePath must not be defined.')
    //       assert.isUndefined(result.previewVideo.originalFilePath, 'result.previewVideo.originalFilePath must not be defined.')
    //       assert.isUndefined(result.thumbnail.originalFilePath, 'result.thumbnail.originalFilePath must not be defined.')
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