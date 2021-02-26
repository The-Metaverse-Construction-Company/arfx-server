/**
 * @lib/frameworks
 */
import supertest from 'supertest'
import {assert} from 'chai'
import httpStatus from 'http-status'
/**
 * @main_app
 */
import App from '../../../../../index'
/**
 * @tester
 */
import {adminSignInResponse} from '../auth.test'
const request = supertest(App)
describe('@Product List API', () => {
  it('should success fetch product list', (done) => {
    request
      .get('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .expect(httpStatus.OK)
      .then((response) => {
        const {success = false, result} = response.body
        assert.isOk(success)
        assert.isNumber(result.pages)
        assert.isNumber(result.total)
        assert.isArray(result.data)
        // assert.isAbove(result.data.length, 0)
        // assert.isUndefined(result.data[0].contentZip.originalFilePath, 'result.contentZip.originalFilePath must not be defined.')
        // assert.isUndefined(result.data[0].previewImage.originalFilePath, 'result.previewImage.originalFilePath must not be defined.')
        // assert.isUndefined(result.data[0].previewVideo.originalFilePath, 'result.previewVideo.originalFilePath must not be defined.')
        // assert.isUndefined(result.data[0].thumbnail.originalFilePath, 'result.thumbnail.originalFilePath must not be defined.')
        done()
      })
      .catch(done)
  })
  it('should success fetch product list with pagination query filter.', (done) => {
    request
      .get('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .query({limit: 20, pageNo: 1})
      .expect(httpStatus.OK)
      .then((response) => {
        const {success = false, result} = response.body
        assert.isOk(success)
        assert.isNumber(result.pages)
        assert.isNumber(result.total)
        assert.isArray(result.data)
        // assert.isAbove(result.data.length, 0)
        done()
      })
      .catch(done)
  })
  it('should failed fetch product list with negative value of pageNo for  pagination query filter.', (done) => {
    request
      .get('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
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
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
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