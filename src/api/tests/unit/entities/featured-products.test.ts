import faker from 'faker'
import {expect} from 'chai'
// import {v4:} from 'uuid'
import FeaturedProduct, { IFeaturedProductEntity } from '../../../domain/entities/featured-product'

export const FeaturedProductEntity = FeaturedProduct({
  generateId: () => {
    return '1'
  }
})
describe('@Featured Product Entity', () => {
  const userObject = <Partial<IFeaturedProductEntity>>{
    active: true,
    indexNo: 1,
    adminAccountId: "1",
    productId: "1"
  }
  it('should be success. Happy Path', () => {
    const featuredProduct = new FeaturedProductEntity(userObject)

    expect(featuredProduct._id).to.be.a('string')
    expect(featuredProduct._id).to.be.not.equal('')

    expect(featuredProduct.productId).to.be.a('string')
    expect(featuredProduct.productId).to.be.not.eq('')

    expect(featuredProduct.adminAccountId).to.be.a('string')
    expect(featuredProduct.adminAccountId).to.be.not.eq('')

    expect(featuredProduct.indexNo).to.be.a('number')
    expect(featuredProduct.indexNo).to.be.eq(1)

    expect(featuredProduct.active).to.be.a('boolean')
    expect(featuredProduct.active).to.be.eq(true, 'featuredProduct.active must be a true')

    expect(featuredProduct.createdAt).to.be.a('number')
    expect(featuredProduct.createdAt).to.be.gt(0)

    expect(featuredProduct.updatedAt).to.be.a('number')
    expect(featuredProduct.updatedAt).to.be.gt(0)
  })

  describe('@productId property', () => {
    it('should succeed. valid value', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          productId: "1"
        })
        expect(featuredProduct.productId).to.be.a('string')
        expect(featuredProduct.productId).to.be.not.eq('')
      } catch (error) {
        expect(error).to.be.eq(null, 'should success. product id is a valid value.')
      }
    })
    it('should failed. value is undefined', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          productId: undefined
        })
        expect.fail('should throw an error.')
      } catch (error) {
        expect(error.message).to.be.eq('productId must not be null, undefined or empty string.')
      }
    })
    it('should failed. value is undefined', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          productId: null
        })
        expect.fail('should throw an error.')
      } catch (error) {
        expect(error.message).to.be.eq('productId must not be null, undefined or empty string.')
      }
    })
    it('should failed. valid value', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          //@ts-expect-error
          productId: 123
        })
        expect(featuredProduct.productId).to.be.a('string')
        expect(featuredProduct.productId).to.be.not.eq('')
      } catch (error) {
        expect(error.message).to.be.eq('productId must be a string.')
      }
    })
  })
  describe('@active property', () => {
    it('should succeed. value is true', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          active: true
        })
        expect(featuredProduct.active).to.be.a('boolean')
        expect(featuredProduct.active).to.be.eq(true)
      } catch (error) {
        expect.fail('should not be failed. valid active value.')
      }
    })
    it('should succeed. value is false', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          active: false
        })
        expect(featuredProduct.active).to.be.a('boolean')
        expect(featuredProduct.active).to.be.eq(false)
      } catch (error) {
        expect.fail('should not be failed. valid active value.')
      }
    })
    it('should success. value is undefined', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          active: undefined
        })
        expect(featuredProduct.active).to.be.a('boolean')
        expect(featuredProduct.active).to.be.eq(false)
      } catch (error) {
        expect(error.message).to.be.eq('productId must not be null, undefined or empty string.')
      }
    })
    it('should failed. value is undefined', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          productId: null
        })
        expect.fail('should throw an error.')
      } catch (error) {
        expect(error.message).to.be.eq('productId must not be null, undefined or empty string.')
      }
    })
  })
  describe('@indexNo property', () => {
    it('should succeed. value is 0', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          indexNo: 0
        })
        expect(featuredProduct.indexNo).to.be.a('number')
        expect(featuredProduct.indexNo).to.be.eq(0)
      } catch (error) {
        expect.fail(`should not be failed. valid indexNo value. error: ${error.message}`)
      }
    })
    it('should succeed. value is 1', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          indexNo: 1
        })
        expect(featuredProduct.indexNo).to.be.a('number')
        expect(featuredProduct.indexNo).to.be.eq(1)
      } catch (error) {
        expect.fail(`should not be failed. valid indexNo value. error: ${error.message}`)
      }
    })
    it('should success. value is undefined', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          indexNo: undefined
        })
        expect(featuredProduct.indexNo).to.be.a('number')
        expect(featuredProduct.indexNo).to.be.eq(0)
      } catch (error) {
        expect.fail(`should not be failed. valid indexNo value. error: ${error.message}`)
      }
    })
    it('should failed. value is null', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          indexNo: null
        })
        expect.fail(`should failed. indexNo value is null, current value: ${featuredProduct.indexNo}`)
      } catch (error) {
        expect(error.message).to.be.eq(`indexNo must be a integer and a whole number.`)

      }
    })
    it('should success. value is 123 as string', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          //@ts-expect-error
          indexNo: "123"
        })
        expect(featuredProduct.indexNo).to.be.a('number')
        expect(featuredProduct.indexNo).to.be.eq(123)
      } catch (error) {
        expect.fail(`should not be failed. valid indexNo value. error: ${error.message}`)
        // expect(error.message).to.be.eq(`indexNo must be a number.`)
      }
    })
    it('should failed. value is string', () => {
      try {
        const featuredProduct = new FeaturedProductEntity({
          ...userObject,
          //@ts-expect-error
          indexNo: "simple index"
        })
        expect.fail(`should failed. indexNo value is null, current value: ${featuredProduct.indexNo}`)
      } catch (error) {
        expect(error.message).to.be.eq(`indexNo must be a integer and a whole number.`)
      }
    })
  })
})