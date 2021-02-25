/**
 * @lib/frameworks
 */
import supertest from 'supertest'
import {assert} from 'chai'
import httpStatus from 'http-status'
/**
 * @main_app
 */
import App from '../../../../index'
/**
 * @tester
 */
import {userSignInResponse} from './sign-in.test'
const request = supertest(App)

describe('@Pagination List Featured Product API', () => {
  it('should success getting featured product.', (done) => {
    request
      .get('/v1/featured-products')
      .set('Authorization', `Bearer ${userSignInResponse.token}`)
      .expect(httpStatus.OK)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isOk(success)
        assert.isArray(result.data)
        assert.isAbove(result.data.length, 0, 'result.data must not be empty array.')
        assert.isUndefined(result.data[0].products.contentZip.originalFilePath, 'result.contentZip.originalFilePath must not be defined.')
        assert.isUndefined(result.data[0].products.previewImage.originalFilePath, 'result.previewImage.originalFilePath must not be defined.')
        assert.isUndefined(result.data[0].products.previewVideo.originalFilePath, 'result.previewVideo.originalFilePath must not be defined.')
        assert.isUndefined(result.data[0].products.thumbnail.originalFilePath, 'result.thumbnail.originalFilePath must not be defined.')
        done()
      })
      .catch(done)
  })
  it('should success getting featured product. with query params', (done) => {
    request
      .get('/v1/featured-products')
      .set('Authorization', `Bearer ${userSignInResponse.token}`)
      .query({
        pageNo: 1,
        limit: 10
      })
      .expect(httpStatus.OK)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isOk(success)
        done()
      })
      .catch(done)
  })
  it('should failed getting featured product. invalid query params limit value', (done) => {
    request
      .get('/v1/featured-products')
      .set('Authorization', `Bearer ${userSignInResponse.token}`)
      .query({
        pageNo: 1,
        limit: "qwe"
      })
      .expect(httpStatus.BAD_REQUEST)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isFalse(success)
        done()
      })
      .catch(done)
  })
  it('should failed getting featured product. invalid query params pageNo value', (done) => {
    request
      .get('/v1/featured-products')
      .set('Authorization', `Bearer ${userSignInResponse.token}`)
      .query({
        pageNo: "qwe",
        limit: 10
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