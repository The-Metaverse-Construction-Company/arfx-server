import supertest from 'supertest'
import {assert} from 'chai'

import App from '../../../../index'
const request = supertest(App)
import {userSignInResponse} from './sign-in.test'
import httpStatus from 'http-status'
describe('@Product API', () => {
  it('should success fetch product list', (done) => {
    request
      .get('/v1/products')
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
      .get('/v1/products')
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
  it('should failed fetch product list with negative value of pageNo for  pagination query filter.', (done) => {
    request
      .get('/v1/products')
      .set('Authorization', `Bearer ${userSignInResponse.token}`)
      .query({limit: 20, pageNo: -100})
      .expect(httpStatus.BAD_REQUEST)
      .then((response) => {
        const {success = false, result, errors} = response.body
        assert.isNotOk(success)
        assert.isAbove(errors.length, 0)
        done()
      })
      .catch(done)
  })
  it('should failed fetch product list with negative value of limit for pagination query filter.', (done) => {
    request
      .get('/v1/products')
      .set('Authorization', `Bearer ${userSignInResponse.token}`)
      .query({limit: -20, pageNo: 1})
      .expect(httpStatus.BAD_REQUEST)
      .then((response) => {
        const {success = false, result, errors} = response.body
        assert.isNotOk(success)
        assert.isAbove(errors.length, 0)
        done()
      })
      .catch(done)
  })
  it('should fetch product list failed due to no authorization key.', (done) => {
    request
      .get('/v1/products')
      .expect(httpStatus.UNAUTHORIZED)
      .then(({body}) => {
        const {success = false, result} = body
        assert.isNotOk(success)
        done()
      })
      .catch(done)
  })
})