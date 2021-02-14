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
        assert.isOk(success)
        done()
      })
      .catch(done)
  })
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