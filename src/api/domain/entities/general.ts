import {
  IGeneralEntityDependencies,
  IGeneralEntityProperties
} from '../interfaces/index'
export default ({
  generateId
}: IGeneralEntityDependencies) => (
  class GeneralEntity implements IGeneralEntityProperties {
    public readonly _id!: string;
    public readonly createdAt!: number;
    public readonly updatedAt!: number;
  
    constructor ({
      _id,
      createdAt = Date.now(),
      updatedAt = Date.now()
    }: Partial<IGeneralEntityProperties>) {
      if (_id) {
        if (typeof(_id) !== 'string') {
          throw new Error('_id must be a string.')
        }
      } else {
        _id = generateId()
      }
      if (!(createdAt && typeof(createdAt) === 'number' && createdAt > 0)) {
        throw new Error('createdAt must be a number in milisecond format.')
      }
      if (!(updatedAt && typeof(updatedAt) === 'number' && updatedAt > 0)) {
        throw new Error('createdAt must be a number in milisecond format.')
      }
      this._id = _id
      this.createdAt = createdAt
      this.updatedAt = updatedAt
    }
    /**
     * validate string variable
     * @param value
     * @param fieldName 
     * @param required boolean, set to false needed to be optional, default: true
     */
    protected validateString (value: string|undefined|null, fieldName: string, required:boolean = true) {
      if (required && !value) {
        throw new Error(`${fieldName} must not be null, undefined or empty string.`)
      } else if (value && typeof(value) !== 'string') {
        throw new Error(`${fieldName} must be a string`)
      }
      return true
    }
    /**
     * validate number variable
     * @param value
     * @param fieldName 
     * @param required boolean, set to false needed to be optional, default: true
     */
    protected validateNumber (value: number|undefined|null, fieldName: string, required:boolean = true) {
      if (required && !value) {
        throw new Error(`${fieldName} must not be null, undefined or 0.`)
      } else if (value && typeof(value) !== 'number') {
        throw new Error(`${fieldName} must be a number`)
      }
      return true
    }
    /**
     * validate boolean variable
     * @param value
     * @param fieldName 
     * @param required boolean, set to false needed to be optional, default: true
     */
    protected validateBoolean (value: boolean|undefined|null, fieldName: string, required:boolean = true) {
      if (typeof(value) !== 'boolean') {
        if (value === 0 || value === 1) {
          value = !!value
        } else if (value && (value === 'true' || value === 'false')) {
          value = JSON.parse(value)
        } else {
          throw new Error(`${fieldName} must be a boolean.`)
        }
      }
      return value
    }
  }
)