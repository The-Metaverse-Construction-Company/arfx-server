import faker from 'faker'
import {expect} from 'chai'
// import {v4:} from 'uuid'
import Product, { IProductEntity } from '../../../domain/entities/product'
import { validateEmailAddress } from '../../../helper'

export const ProductEntity = Product({
  generateId: () => "1"
})

describe('@Product Entity', () => {
  const userObject = <Partial<IProductEntity>>{
    name: faker.name.findName(),
    title: faker.name.title(),
    description: faker.lorem.paragraph(),
    price: parseInt(faker.finance.amount(0, 100)),
    discountPercentage: 50,
    purchaseCount: 0,
    adminAccountId: '1',
    published: true,
    contentZip: {
      blobURL: faker.image.abstract(),
      hash: '',
      originalFilepath: '',
      version: 1
    },
    previewImage: {
      blobURL: faker.image.abstract(),
      originalFilepath: ''
    },
    previewVideo: {
      blobURL: '',
      originalFilepath: ''
    },
    thumbnail: {
      blobURL: faker.image.abstract(),
      originalFilepath: ''
    },
  }
  it('should be success. Happy Path', () => {
    const newProduct = new ProductEntity(userObject)

    expect(newProduct._id).to.be.a('string')
    expect(newProduct._id).to.be.not.equal('')

    expect(newProduct.title).to.be.a('string')
    expect(newProduct.title).to.be.not.equal('')

    expect(newProduct.name).to.be.a('string')
    expect(newProduct.name).to.be.not.equal('')

    expect(newProduct.description).to.be.a('string')
    expect(newProduct.description).to.be.not.equal('')

    expect(newProduct.price).to.be.a('number')
    expect(newProduct.price).to.be.gte(0)
    
    expect(newProduct.discountPercentage).to.be.a('number')
    expect(newProduct.discountPercentage).to.be.gte(0)
    
    expect(newProduct.published).to.be.a('boolean')
    expect(newProduct.published).to.be.true
    
    expect(newProduct.purchaseCount).to.be.a('number')
    expect(newProduct.purchaseCount).to.be.gte(0)
    
    expect(newProduct.contentZip.blobURL).to.be.a('string')
    expect(newProduct.contentZip.originalFilepath).to.be.a('string')

    expect(newProduct.previewImage.blobURL).to.be.a('string')
    expect(newProduct.previewImage.originalFilepath).to.be.a('string')

    expect(newProduct.previewVideo.blobURL).to.be.a('string')
    expect(newProduct.previewVideo.blobURL).to.be.a('string')

    expect(newProduct.thumbnail.originalFilepath).to.be.a('string')
    expect(newProduct.thumbnail.originalFilepath).to.be.a('string')

    expect(newProduct.createdAt).to.be.a('number')
    expect(newProduct.createdAt).to.be.gt(0)

    expect(newProduct.updatedAt).to.be.a('number')
    expect(newProduct.updatedAt).to.be.gt(0)
  })

  describe('@name property', () => {
    it('should succeed. ', () => {
      try {
        const newProduct = new ProductEntity({
          ...userObject,
          name: faker.name.findName()
        })
        expect(newProduct.name).to.be.string
        expect(newProduct.name).not.to.be.null
        expect(newProduct.name).not.to.be.equal('')
      } catch (error) {
        expect.fail(`should error. name value: ${error.message}`)
      }
    })
    it('should failed. no name provided', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          name: undefined,
        })
        expect(product.name).to.be.a('string')
      } catch (error) {
        expect(error.message).to.be.equal('name must not be null, undefined or empty string.')
      }
    })
    it('should failed. invalid name', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          //@ts-expect-error
          name: 12345
        })
        expect(product.name).to.be.a('string')
      } catch (error) {
        expect(error.message).to.be.equal('name must be a string.')
      }
    })
    it('should failed. short name length', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          name: "S1"
        })
        expect.fail('must be failed because of the length of the name character.')
      } catch (error) {
        expect(error.message).to.be.equal('name must atleast 3 characters.')
      }
    })
  })
  describe('@title property', () => {
    it('should succeed. valid title', () => {
      try {
        const newProduct = new ProductEntity({
          ...userObject,
          title: faker.name.findName()
        })
        expect(newProduct.title).to.be.string
        expect(newProduct.title).not.to.be.null
        expect(newProduct.title).not.to.be.equal('')
      } catch (error) {
        expect.fail(`should error. title value: ${error.message}`)
      }
    })
    it('should failed. no title provided', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          title: undefined,
        })
        expect(product.title).to.be.a('string')
      } catch (error) {
        expect(error.message).to.be.equal('title must not be null, undefined or empty string.')
      }
    })
    it('should failed. invalid title', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          //@ts-expect-error
          title: 12345
        })
        expect(product.title).to.be.a('string')
      } catch (error) {
        expect(error.message).to.be.equal('title must be a string.')
      }
    })
    it('should failed. short title length', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          title: "S1"
        })
        expect.fail('must be failed because of the length of the title character.')
      } catch (error) {
        expect(error.message).to.be.equal('title must atleast 3 characters.')
      }
    })
  })
  describe('@description property', () => {
    it('should succeed. valid description', () => {
      try {
        const newProduct = new ProductEntity({
          ...userObject,
          description: faker.name.findName()
        })
        expect(newProduct.description).to.be.string
        expect(newProduct.description).not.to.be.null
        expect(newProduct.description).not.to.be.equal('')
      } catch (error) {
        expect.fail(`should error. description value: ${error.message}`)
      }
    })
    it('should failed. no description provided', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          description: undefined,
        })
        expect(product.description).to.be.a('string')
      } catch (error) {
        expect(error.message).to.be.equal('description must not be null, undefined or empty string.')
      }
    })
    it('should failed. invalid description', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          //@ts-expect-error
          description: 12345
        })
        expect(product.description).to.be.a('string')
      } catch (error) {
        expect(error.message).to.be.equal('description must be a string.')
      }
    })
    it('should succeed. with numeric string value', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          description: "12345"
        })
        expect(product.description).to.be.a('string')
      } catch (error) {
        expect(error.message).to.be.null
      }
    })
  })

  describe('@price property', () => {
    it('should succeed. valid price', () => {
      try {
        const newProduct = new ProductEntity({
          ...userObject,
          price: 50
        })
        expect(newProduct.price).to.be.a('number')
        expect(newProduct.price).to.be.equal(50)
      } catch (error) {
        expect.fail(`should error. price value: ${error.message}`)
      }
    })
    it('should failed. price null value', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          price: null,
        })
        expect(product.price).to.be.a('number')
      } catch (error) {
        expect(error.message).to.be.equal('price must be a numeric with 2 decimal places.')
      }
    })
    it('should success. price with 13 value as a string.', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          //@ts-expect-error
          price: '13',
        })
        expect(product.price).to.be.a('number')
      } catch (error) {
        expect(error.message).to.be.equal('price must be a numeric with 2 decimal places.')
      }
    })
    it('should failed. no price provided', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          price: undefined,
        })
        expect(product.price).to.be.a('number')
      } catch (error) {
        expect(error.message).to.be.equal('price must be greater than 0.')
      }
    })
    it('should failed. price with negative value', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          price: -20,
        })
        expect(product.price).to.be.a('number')
      } catch (error) {
        expect(error.message).to.be.equal('price must be greater than 0.')
      }
    })
    it('should failed. invalid price variable type.', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          //@ts-expect-error
          price: "1strxing",
        })
        expect(product.price).to.be.a('number')
      } catch (error) {
        expect(error.message).to.be.equal('price must be a numeric with 2 decimal places.')
      }
    })
  })
  describe('@discountPercentage property', () => {
    it('should succeed. valid discountPercentage', () => {
      try {
        const newProduct = new ProductEntity({
          ...userObject,
          discountPercentage: 50
        })
        expect(newProduct.discountPercentage).to.be.a('number')
        expect(newProduct.discountPercentage).to.be.equal(50)
      } catch (error) {
        expect.fail(`should error. discountPercentage value: ${error.message}`)
      }
    })
    it('should failed. discountPercentage with negative value.', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          discountPercentage: -10,
        })
        expect(product.discountPercentage).to.be.a('number')
      } catch (error) {
        expect(error.message).to.be.equal('discountPercentage must be greater than 0.')
      }
    })
    it('should failed. discountPercentage with null value.', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          discountPercentage: 0,
        })
        expect(product.discountPercentage).to.be.a('number')
      } catch (error) {
        expect(error.message).to.be.equal('discountPercentage must be a integer and a whole number.')
      }
    })
    it('should failed. no discountPercentage provided', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          discountPercentage: undefined,
        })
        expect(product.discountPercentage).to.be.a('number')
      } catch (error) {
        expect(error.message).to.be.equal('discountPercentage must be greater than 0.')
      }
    })
    it('should failed. invalid discountPercentage variable type.', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          //@ts-expect-error
          discountPercentage: "1strxing",
        })
        expect(product.discountPercentage).to.be.a('number')
      } catch (error) {
        expect(error.message).to.be.equal('discountPercentage must be a integer and a whole number.')
      }
    })
  })
  describe('@published property', () => {
    it('should succeed. valid published value true', () => {
      try {
        const newProduct = new ProductEntity({
          ...userObject,
          published: true
        })
        expect(newProduct.published).to.be.a('boolean')
        expect(newProduct.published).to.be.equal(true)
      } catch (error) {
        expect.fail(`should error. discountPercentage value: ${error.message}`)
      }
    })
    it('should succeed. valid published value false', () => {
      try {
        const newProduct = new ProductEntity({
          ...userObject,
          published: false
        })
        expect(newProduct.published).to.be.a('boolean')
        expect(newProduct.published).to.be.equal(false)
      } catch (error) {
        expect.fail(`should error. discountPercentage value: ${error.message}`)
      }
    })
    it('should succeed. published 0 value.', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          //@ts-expect-error
          published: 0,
        })
        expect(product.published).to.be.a('boolean')
        expect(product.published).to.be.eql(false)
      } catch (error) {
        expect(error.message).to.be.null
      }
    })
    it('should succeed. published 0 value.', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          //@ts-expect-error
          published: 1,
        })
        expect(product.published).to.be.a('boolean')
        expect(product.published).to.be.eql(true)
      } catch (error) {
        expect(error.message).to.be.null
      }
    })
    it('should succeed. published is undefined.', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          published: undefined,
        })
        expect(product.published).to.be.a('boolean')
        expect(product.published).to.be.eql(true)
      } catch (error) {
        expect(error.message).to.be.null
      }
    })
    it('should failed. published is null.', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          published: null,
        })
        expect(product.published).to.be.a('boolean')
        expect(product.published).to.be.eql(true)
      } catch (error) {
        expect(error.message).to.be.eq('published must be a boolean.')
      }
    })
    it('should failed. published value is string', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          //@ts-expect-error
          published: "qwerty",
        })
        expect(product.published).to.be.a('boolean')
        expect(product.published).to.be.eql(true)
      } catch (error) {
        expect(error.message).to.be.eq('published must be a boolean.')
      }
    })
    it('should failed. published value is numeric negative value that greater than 1', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          //@ts-expect-error
          published: -123,
        })
        expect(product.published).to.be.a('boolean')
        expect(product.published).to.be.eql(true)
      } catch (error) {
        expect(error.message).to.be.eq('published must be a boolean.')
      }
    })
    it('should failed. published value is numeric positive value that greater than 1', () => {
      try {
        const product = new ProductEntity({
          ...userObject,
          //@ts-expect-error
          published: 123,
        })
        expect(product.published).to.be.a('boolean')
        expect(product.published).to.be.eql(true)
      } catch (error) {
        expect(error.message).to.be.eq('published must be a boolean.')
      }
    })
  })
})