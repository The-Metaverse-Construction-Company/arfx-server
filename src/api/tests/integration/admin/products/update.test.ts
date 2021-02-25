/**
 * @lib/frameworks
 */
import supertest from 'supertest'
import {assert} from 'chai'
import httpStatus from 'http-status'
import faker from 'faker'
/**
 * @main_app
 */
import App from '../../../../../index'
/**
 * @tester
 */
import {adminSignInResponse} from '../auth.test'
import {addedProductResponse} from './create.test'
const title = faker.lorem.word(4)
const request = supertest(App)
describe('@Update Product API', () => {
  it('should success update product.', (done) => {
    request
      .patch(`/v1/products/${addedProductResponse._id}`)
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .field('name', title)
      .field('title', title)
      .field('description', faker.lorem.sentence())
      .field('price', Number(faker.finance.amount(1, 25)))
      .expect(httpStatus.ACCEPTED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        assert.isTrue(success)
        assert.isUndefined(result.contentZip, 'result.contentZip must not be defined.')
        assert.isUndefined(result.previewImage.originalFilePath, 'result.previewImage.originalFilePath must not be defined.')
        assert.isUndefined(result.previewVideo.originalFilePath, 'result.previewVideo.originalFilePath must not be defined.')
        assert.isUndefined(result.thumbnail.originalFilePath, 'result.thumbnail.originalFilePath must not be defined.')
        done()
      })
      .catch(done)
  })
  describe('@produce price', () => {
    it('should failed creating update due to incorrect variable types for product price.', (done) => {
      request
        .patch(`/v1/products/${addedProductResponse._id}`)
        .set('Authorization', `Bearer ${adminSignInResponse.token}`)
        .field('name', title)
        .field('title', title)
        .field('description', faker.lorem.sentence())
        .field('price', 'x12')
        .expect(httpStatus.BAD_REQUEST)
        .then(({body}) => {
          const {success = false, result, errors} = body
          assert.isNotOk(success)
          done()
        })
        .catch(done)
    })
    it('should failed update product due to incorrect negative value for product price.', (done) => {
      request
        .patch(`/v1/products/${addedProductResponse._id}`)
        .set('Authorization', `Bearer ${adminSignInResponse.token}`)
        .field('name', title)
        .field('title', title)
        .field('description', faker.lorem.sentence())
        .field('price', -15)
        .expect(httpStatus.BAD_REQUEST)
        .then(({body}) => {
          const {success = false, result, errors} = body
          assert.isNotOk(success)
          done()
        })
        .catch(done)
    })
  })
  describe('@product discount percentage', () => {
    it('should failed creating product due to incorrect negative value of discount percentage.', (done) => {
      request
        .patch(`/v1/products/${addedProductResponse._id}`)
        .set('Authorization', `Bearer ${adminSignInResponse.token}`)
        .field('name', title)
        .field('title', title)
        .field('description', faker.lorem.sentence())
        .field('price', 15)
        .field('discountPercentage', -10)
        .expect(httpStatus.BAD_REQUEST)
        .then(({body}) => {
          const {success = false, result, errors} = body
          assert.isNotOk(success)
          done()
        })
        .catch(done)
    })
    it('should failed creating product due to incorrect value of discount percentage that greater than 100.', (done) => {
      request
        .patch(`/v1/products/${addedProductResponse._id}`)
        .set('Authorization', `Bearer ${adminSignInResponse.token}`)
        .field('name', title)
        .field('title', title)
        .field('description', faker.lorem.sentence())
        .field('price', 15)
        .field('discountPercentage', 105)
        .expect(httpStatus.BAD_REQUEST)
        .then(({body}) => {
          const {success = false, result, errors} = body
          assert.isNotOk(success)
          done()
        })
        .catch(done)
    })
  })
  describe('@product published status', () => {
    it('should success creating product with pusblished status to true', (done) => {
      request
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminSignInResponse.token}`)
        .field('name', title)
        .field('title', title)
        .field('description', faker.lorem.sentence())
        .field('price', 15)
        .field('discountPercentage', 10)
        .field('published', true)
        .expect(httpStatus.CREATED)
        .then(({body}) => {
          const {success = false, result, errors} = body
          // assert.isTrue(success)
          console.log('result :>> ', result);
          assert.isString(result._id, 'product _id must be a string')
          assert.isTrue(result.published, 'product published status must be a true')
          // assert.isTrue(result.published, 'product published status must be a true')
          done()
        })
        .catch(done)
    })
    it('should success creating product with pusblished status to true', (done) => {
      request
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminSignInResponse.token}`)
        .field('name', title)
        .field('title', title)
        .field('description', faker.lorem.sentence())
        .field('price', 15)
        .field('discountPercentage', 10)
        .field('published', false)
        .expect(httpStatus.CREATED)
        .then(({body}) => {
          const {success = false, result, errors} = body
          assert.isTrue(success)
          assert.isString(result._id, 'product _id must be a string')
          assert.isFalse(result.published, 'product published status must be a false')
          done()
        })
        .catch(done)
    })
    it('should failed creating product with pusblished status to string value', (done) => {
      request
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminSignInResponse.token}`)
        .field('name', title)
        .field('title', title)
        .field('description', faker.lorem.sentence())
        .field('price', 15)
        .field('discountPercentage', 10)
        .field('published', "simple boolean")
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