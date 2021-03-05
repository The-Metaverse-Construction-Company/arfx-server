import faker from 'faker'
import {expect} from 'chai'
// import {v4} from 'uuid'
import PurchaseHistory, { ALLOWED_PURCHASE_HISTORY_STATES, IPurchaseHistoryEntity, PURCHASE_HISTORY_STATE } from '../../../domain/entities/purchase-history'
import { validateNumeric, validateString } from '../general'
import { PRODUCT_UPLOAD_BLOB_STATES } from '../../../domain/entities/product'

export const Entity = PurchaseHistory({
  generateId: () => {
    return '1'
  }
})
describe('@Purchase History Entity', () => {
  const entityObject:Partial<IPurchaseHistoryEntity> = {
    name: faker.name.findName(),
    title: faker.name.title(),
    description: faker.lorem.paragraph(),
    price: parseInt(faker.finance.amount(0, 100)),
    discountPercentage: parseFloat(faker.finance.amount(0, 1, 2)),
    contentZip: {
      blobURL: faker.image.abstract(),
      hash: '',
      originalFilepath: '',
      version: 1,
      state: PRODUCT_UPLOAD_BLOB_STATES.PENDING
    },
    previewImage: {
      blobURL: faker.image.abstract(),
      originalFilepath: '',
      state: PRODUCT_UPLOAD_BLOB_STATES.PENDING
    },
    previewVideo: {
      blobURL: '',
      originalFilepath: '',
      state: PRODUCT_UPLOAD_BLOB_STATES.PENDING
    },
    thumbnail: {
      blobURL: faker.image.abstract(),
      originalFilepath: '',
      state: PRODUCT_UPLOAD_BLOB_STATES.PENDING
    },
    amount: parseInt(faker.finance.amount(0, 100)),
    productId: "1",
    purchasedAt: Date.now(),
    state: PURCHASE_HISTORY_STATE.FAILED,
    userId: "1",
    paymentChargeId: "1",
    paymentIntentId: "1",
    paymentMethodId: "1"
  }
  it('should be success. Happy Path', () => {
    const entity = new Entity(entityObject)

    expect(entity._id).to.be.a('string')
    expect(entity._id).to.be.not.equal('', '_id must not be empty.')

    expect(entity.productId).to.be.a('string')
    expect(entity.productId).to.be.not.eq('', 'productId must not be empty.')

    expect(entity.userId).to.be.a('string')
    expect(entity.userId).to.be.not.eq('', 'userId must not be empty.')

    expect(entity.createdAt).to.be.a('number')
    expect(entity.createdAt).to.be.gt(0)

    expect(entity.updatedAt).to.be.a('number')
    expect(entity.updatedAt).to.be.gt(0)
  })
  describe('@productId property', () => {
    validateString(Entity, entityObject, 'productId')
  })
  describe('@userId property', () => {
    validateString(Entity, entityObject, 'userId')
  })
  describe('@paymentChargeId property', () => {
    validateString(Entity, entityObject, 'paymentChargeId')
  })
  describe('@paymentIntentId property', () => {
    validateString(Entity, entityObject, 'paymentIntentId')
  })
  describe('@paymentMethodId property', () => {
    validateString(Entity, entityObject, 'paymentMethodId')
  })
  describe('@state property', () => {
    validateNumeric(Entity, entityObject, 'state')
    it('should failed. Invalid state', () => {
      try {
        const entity = new Entity({
          ...entityObject,
          state: 10
        })
        expect(entity.state).to.be.a('number')
      } catch (error) {
        expect(error.message).to.be.eq(`Invalid state value. only allowed states are ${ALLOWED_PURCHASE_HISTORY_STATES.join(', ')}.`)
      }
    })
  })
  describe('@purchasedAt property', () => {
    validateNumeric(Entity, entityObject, 'purchasedAt')
  })
})