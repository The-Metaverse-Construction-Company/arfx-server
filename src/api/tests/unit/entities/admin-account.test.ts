import faker from 'faker'
import {expect} from 'chai'
// import {v4} from 'uuid'
import AdminEntity, { ADMIN_ROLE_LEVEL, ALLOWED_ADMIN_ROLE_LEVEL, IAdminAccountsEntity } from '../../../domain/entities/admin-accounts'
import { validateBoolean, validateNumeric, validateString, getNestedPropertyValue, setNestedPropertyValue } from '../general'
import { validateEmailDomain } from '../../../helper'

export const Entity = AdminEntity({
  generateId: () => {
    return '1'
  },
  hash: (hash: string) => "simple hash",
  validateEmailDomain: validateEmailDomain
})
describe('@Admin Account Entity', () => {
  const entityObject:Partial<IAdminAccountsEntity> = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: {
      value: faker.internet.email(),
      verified: false,
      verifiedAt: 0
    },
    password: faker.internet.password(16),
    roleLevel: ADMIN_ROLE_LEVEL.ADMIN
  }
  it('should be success. Happy Path', () => {
    const entity = new Entity(entityObject)
    expect(entity._id).to.be.a('string')
    expect(entity._id).to.be.not.equal('', '_id must not be empty.')

    expect(entity.firstName).to.be.a('string')
    expect(entity.firstName).to.be.not.eq('', 'firstName must not be empty.')

    expect(entity.lastName).to.be.a('string')
    expect(entity.lastName).to.be.not.eq('', 'lastName must not be empty.')

    expect(entity.password).to.be.a('string')
    expect(entity.password).to.be.not.eq('', 'password must not be empty.')

    expect(entity.email.value).to.be.a('string')
    expect(entity.email.value).to.be.not.eq('', 'email.value must not be empty.')

    expect(entity.email.verified).to.be.a('boolean')

    expect(entity.email.verifiedAt).to.be.a('number')
    expect(entity.email.verifiedAt).to.be.gte(0, 'verifiedAt must greater than 0.')

    expect(entity.roleLevel).to.be.a('number')
    expect(entity.roleLevel).to.be.eq(ADMIN_ROLE_LEVEL.ADMIN, `roleLevel must equal to ${ADMIN_ROLE_LEVEL.ADMIN}.`)

    expect(entity.createdAt).to.be.a('number')
    expect(entity.createdAt).to.be.gt(0)

    expect(entity.updatedAt).to.be.a('number')
    expect(entity.updatedAt).to.be.gt(0)
  })
  describe('@firstName property', () => {
    validateString(Entity, entityObject, 'firstName')
  })
  describe('@lastName property', () => {
    validateString(Entity, entityObject, 'lastName')
  })
  describe('@password property', () => {
    validateString(Entity, entityObject, 'password')
  })
  describe('@email.value property', () => {
    validateString(Entity, entityObject, 'email.value')
  })
  describe('@email.verifiedAt property', () => {
    validateNumeric(Entity, entityObject, 'email.verifiedAt')
  })
  describe('@email.verified property', () => {
    validateBoolean(Entity, entityObject, 'email.verified')
  })
  describe('@roleLevel property', () => {
    validateNumeric(Entity, entityObject, 'roleLevel')
    it('should failed. invalid role level', () => {
      try {
        const entity = new Entity(setNestedPropertyValue(entityObject, 'roleLevel', 10))
        expect(entity.roleLevel).to.be.a('number')
      } catch (error) {
        expect(error.message).to.be.eq(`Invalid role level. allowed roleLevel are ${ALLOWED_ADMIN_ROLE_LEVEL.join(', ')}. found: 10`)
      }
    })
  })
})