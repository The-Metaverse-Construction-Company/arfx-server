import {expect} from 'chai'
import faker from 'faker'
interface IValidateStringOptions {
  isEmailAddress?: boolean
}
export const getNestedPropertyValue = (entity: any, fieldName: string) => {
  return fieldName.split('.').reduce((e: any, fieldName: string) => {
    return e[fieldName]
  }, entity)
}
export const setNestedPropertyValue = (entityObject: any, fieldName: string, value: any) => {
  entityObject = JSON.parse(JSON.stringify(entityObject))
  const nestedProperties = fieldName.split('.')
  const parentProperty = nestedProperties.shift()
  if (typeof(entityObject[parentProperty]) === 'object') {
    entityObject[parentProperty] = setNestedPropertyValue(entityObject[parentProperty], nestedProperties.join('.'), value)
  } else {
    entityObject[parentProperty] = value
  }
  return entityObject
}
export function validateString<K>(Entity: any , entityObject: any, fieldName: string, option: IValidateStringOptions = {}) {
  const {isEmailAddress = false} = option
  it('should succeed. valid value', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, isEmailAddress ? faker.internet.email() : faker.name.firstName()))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('string')
      expect(getNestedPropertyValue(entity, fieldName)).to.be.not.eq('', `${fieldName} must not be empty.`)
    } catch (error) {
      expect(error).to.be.eq(null, `should success. ${fieldName} is a valid value`)
    }
  })
  it('should failed. value is empty string', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, ''))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('string')
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must not be null, undefined or empty string.`)
    }
  })
  it('should failed. value is null', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, null))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('string')
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must not be null, undefined or empty string.`)
    }
  })
  it('should failed. value is undefined', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, undefined))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('string')
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must not be null, undefined or empty string.`)
    }
  })
  it('should failed. value is integer', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, 123))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('string')
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must be a string.`)
    }
  })
  it('should failed. value is boolean', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, true))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('string')
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must be a string.`)
    }
  })
}
export const validateNumeric = (Entity: any, entityObject: any, fieldName: any) => {
  entityObject = JSON.parse(JSON.stringify(entityObject))
  it('should succeed. valid value', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, 1))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('number')
      expect(getNestedPropertyValue(entity, fieldName)).to.be.not.eq('', `${fieldName} must not be empty.`)
    } catch (error) {
      expect(error).to.be.eq(null, `should success. ${fieldName} is a valid value`)
    }
  })
  it('should failed. value is empty string', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, ''))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('number')
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must be a integer and a whole number.`)
    }
  })
  it('should failed. value is null', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, null))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('number')
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must be a integer and a whole number.`)
    }
  })
  it('should failed. value is undefined', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, undefined))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('number')
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must be a integer and a whole number.`)
    }
  })
  it('should failed. value is string', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, "test"))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('number')
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must be a integer and a whole number.`)
    }
  })
  it('should failed. value is boolean', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, true))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('number')
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must be a integer and a whole number.`)
    }
  })
}
export const validateBoolean = (Entity: any, entityObject: any, fieldName: any) => {
  entityObject = JSON.parse(JSON.stringify(entityObject))
  it('should succeed. value is true', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, true))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('boolean')
      expect(getNestedPropertyValue(entity, fieldName)).to.be.equal(true)
    } catch (error) {
      expect.fail(`should succeed. ${fieldName} value: ${error.message}`)
    }
  })
  it('should succeed. value is false', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, false))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('boolean')
      expect(getNestedPropertyValue(entity, fieldName)).to.be.equal(false)
    } catch (error) {
      expect.fail(`should succeed. ${fieldName} value: ${error.message}`)
    }
  })
  it('should succeed. value is 0', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, 0))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('boolean')
      expect(getNestedPropertyValue(entity, fieldName)).to.be.eql(false)
    } catch (error) {
      expect.fail(`should succeed. ${fieldName} value: ${error.message}`)
    }
  })
  it('should succeed. value is 1', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, 1))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('boolean')
      expect(getNestedPropertyValue(entity, fieldName)).to.be.eq(true)
    } catch (error) {
      expect.fail(`should succeed. ${fieldName} value: ${error.message}`)
    }
  })
  it('should succeed. value is undefined.', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, undefined))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('boolean')
    } catch (error) {
      expect.fail(`should succeed. ${fieldName} value: ${error.message}`)
    }
  })
  it('should failed. value is null.', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, null))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('boolean')
      expect(getNestedPropertyValue(entity, fieldName)).to.be.eql(true)
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must be a boolean.`)
    }
  })
  it('should failed. value is string', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, `qwerty`))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('boolean')
      expect(getNestedPropertyValue(entity, fieldName)).to.be.eql(true)
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must be a boolean.`)
    }
  })
  it('should failed. value is numeric negative value that greater than 1', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, -123))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('boolean')
      expect(getNestedPropertyValue(entity, fieldName)).to.be.eql(true)
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must be a boolean.`)
    }
  })
  it('should failed. value is numeric positive value that greater than 1', () => {
    try {
      const entity = new Entity(setNestedPropertyValue(entityObject, fieldName, 123))
      expect(getNestedPropertyValue(entity, fieldName)).to.be.a('boolean')
      expect(getNestedPropertyValue(entity, fieldName)).to.be.eql(true)
    } catch (error) {
      expect(error.message).to.be.eq(`${fieldName} must be a boolean.`)
    }
  })
}