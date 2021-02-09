/**
 * @lib/frameworks
 */
import supertest from 'supertest'
import {assert} from 'chai'
import httpStatus from 'http-status'
import faker from 'faker'
import path from 'path'
/**
 * @main_app
 */
import App from '../../../../../index'
/**
 * @tester
 */
import {adminSignInResponse} from '../auth.test'
import { IProductEntity } from '../../../../domain/entities/product'
const title = faker.lorem.word(4)
const productObj = {
  name: title,
  title: title,
  description: faker.lorem.sentence(),
  price: Number(faker.finance.amount(1, 25)),
}
export let addedProductResponse = <IProductEntity>{}
const request = supertest(App)
describe('@Create Product API', () => {
  it('should success creating product.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .attach('contentZip', path.join(__dirname, '../../../../../../test/products/contentzip.zip'))
      .attach('previewImage', path.join(__dirname, '../../../../../../test/products/preview-image.png'))
      .attach('previewVideo', path.join(__dirname, '../../../../../../test/products/preview-video.mp4'))
      .field('name', title)
      .field('title', title)
      .field('description', faker.lorem.sentence())
      .field('price', Number(faker.finance.amount(1, 25)))
      .field('discountPercentage', -10)
      .expect(httpStatus.CREATED)
      .then(({body}) => {
        const {success = false, result, errors} = body
        addedProductResponse = result
        assert.isOk(success)
        assert.isString(result._id, 'prodct _id must be a string')
        assert.isString(result.name, 'prodct name must be a string')
        assert.isString(result.title, 'prodct title must be a string')
        assert.isString(result.description, 'prodct description must be a string')
        assert.isNumber(result.price, 'prodct price must be a numeric.')
        assert.isAbove(result.price, 0, 'prodct price must be not be lower than 0.')
        assert.isAbove(result.discountPercentage, -1, 'prodct discountPercentage must be not be lower than 0.')
        assert.isBoolean(result.published, 'prodct published must be boolean.')
        done()
      })
      .catch((err) => {
        console.log('objxxxxect :>> ', err);
        done(err)
      })
  })
  it('should failed creating product due to incorrect variable types for product price.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .attach('contentZip', path.join(__dirname, '../../../../../../test/products/contentzip.zip'))
      .attach('previewImage', path.join(__dirname, '../../../../../../test/products/preview-image.png'))
      .attach('previewVideo', path.join(__dirname, '../../../../../../test/products/preview-video.mp4'))
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
      .catch((err) => {
        console.log('object :>> ', err);
        done(err)
      })
  })
  it('should failed creating product due to incorrect negative value for product price.', (done) => {
    request
      .post('/v1/products')
      .set('Authorization', `Bearer ${adminSignInResponse.token}`)
      .attach('contentZip', path.join(__dirname, '../../../../../../test/products/contentzip.zip'))
      .attach('previewImage', path.join(__dirname, '../../../../../../test/products/preview-image.png'))
      .attach('previewVideo', path.join(__dirname, '../../../../../../test/products/preview-video.mp4'))
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