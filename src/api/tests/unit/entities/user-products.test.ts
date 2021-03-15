import faker from 'faker'
import {expect} from 'chai'
// import {v4} from 'uuid'
import FeaturedProduct, { IUserProductsEntity } from '../../../domain/entities/user-products'

export const UserProductsEntity = FeaturedProduct({
  generateId: () => {
    return '1'
  }
})
describe('@User Product Entity', () => {
  const entityObject = <Partial<IUserProductsEntity>>{
    userId: "qwertyboyo",
    productId: "qwerty",
  }
  it('should be success. Happy Path', () => {
    const Entity = new UserProductsEntity(entityObject)

    expect(Entity._id).to.be.a('string')
    expect(Entity._id).to.be.not.equal('', '_id must not be empty.')

    expect(Entity.productId).to.be.a('string')
    expect(Entity.productId).to.be.not.eq('', 'productId must not be empty.')

    expect(Entity.userId).to.be.a('string')
    expect(Entity.userId).to.be.not.eq('', 'userId must not be empty.')

    expect(Entity.createdAt).to.be.a('number')
    expect(Entity.createdAt).to.be.gt(0)

    expect(Entity.updatedAt).to.be.a('number')
    expect(Entity.updatedAt).to.be.gt(0)
  })

  describe('@productId property', () => {
    it('should succeed. valid value', () => {
      try {
        const Entity = new UserProductsEntity({
          ...entityObject,
          productId: "1"
        })
        expect(Entity.productId).to.be.a('string')
        expect(Entity.productId).to.be.not.eq('', 'productId must not be empty.')
      } catch (error) {
        expect(error).to.be.eq(null, 'should success. product id is a valid value.')
      }
    })
    it('should failed. value is empty string', () => {
      try {
        const Entity = new UserProductsEntity({
          ...entityObject,
          productId: ''
        })
        expect.fail('should throw an error.')
      } catch (error) {
        expect(error.message).to.be.eq('productId must not be null, undefined or empty string.')
      }
    })
    it('should failed. value is undefined', () => {
      try {
        const Entity = new UserProductsEntity({
          ...entityObject,
          productId: undefined
        })
        expect.fail('should throw an error.')
      } catch (error) {
        expect(error.message).to.be.eq('productId must not be null, undefined or empty string.')
      }
    })
    it('should failed. value is integer', () => {
      try {
        const Entity = new UserProductsEntity({
          ...entityObject,
          //@ts-expect-error
          productId: 123
        })
        expect.fail('should throw an error.')
      } catch (error) {
        expect(error.message).to.be.eq('productId must be a string.')
      }
    })
    it('should failed. value is boolean', () => {
      try {
        const Entity = new UserProductsEntity({
          ...entityObject,
          //@ts-expect-error
          productId: true
        })
        expect.fail('should throw an error.')
      } catch (error) {
        expect(error.message).to.be.eq('productId must be a string.')
      }
    })
  })
  describe('@userId property', () => {
    it('should succeed. valid value', () => {
      try {
        const Entity = new UserProductsEntity({
          ...entityObject,
          userId: "1"
        })
        expect(Entity.userId).to.be.a('string')
        expect(Entity.userId).to.be.not.eq('', 'userId must not be empty.')
      } catch (error) {
        expect(error).to.be.eq(null, 'should success. product id is a valid value.')
      }
    })
    it('should failed. value is empty string', () => {
      try {
        const Entity = new UserProductsEntity({
          ...entityObject,
          userId: ''
        })
        expect.fail('should throw an error.')
      } catch (error) {
        expect(error.message).to.be.eq('userId must not be null, undefined or empty string.')
      }
    })
    it('should failed. value is undefined', () => {
      try {
        const Entity = new UserProductsEntity({
          ...entityObject,
          userId: undefined
        })
        expect.fail('should throw an error.')
      } catch (error) {
        expect(error.message).to.be.eq('userId must not be null, undefined or empty string.')
      }
    })
    it('should failed. value is integer', () => {
      try {
        const Entity = new UserProductsEntity({
          ...entityObject,
          //@ts-expect-error
          userId: 123
        })
        expect.fail('should throw an error.')
      } catch (error) {
        expect(error.message).to.be.eq('userId must be a string.')
      }
    })
    it('should failed. value is boolean', () => {
      try {
        const Entity = new UserProductsEntity({
          ...entityObject,
          //@ts-expect-error
          userId: true
        })
        expect.fail('should throw an error.')
      } catch (error) {
        expect(error.message).to.be.eq('userId must be a string.')
      }
    })
  })
})