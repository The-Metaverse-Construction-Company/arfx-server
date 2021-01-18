export interface IGeneralEntityProperties {
  _id: string
  // id?: any
  createdAt: number
  updatedAt: number
}
export interface IGeneralEntityPropertiesWithAddedBy extends IGeneralEntityProperties {
  addedBy: IAddedBy
}

export interface IGeneralVerificationEntityProperties  {
  value: string
  verifiedAt: number
  isVerified: boolean
}
export interface IAddedBy {
  _id: string
}
export interface IGeneralEntityDependencies {
  generateId: () => string
}
export interface IGeneralInteractorDependencies<T> {
  repositoryGateway: T
}
export interface IUploadFiles {
  fieldName: string
  originalFilename: string
  path: string
  size: number
  name: string
  type: string
}
export interface IEnumExtractor {
  keys: (_enum: any) => string[]
  values: <T>(_enum: any) => T[]
  // values: <T>(_enum: T) => <X extends keyof T>[]
}
export interface ICallback<T> {
  (error: any, payload: null|T): void
}

export interface IUploaderResponse {
  imageUrl: string
}
export interface IUploader {
  upload: (path: string, file: IUploadFiles) => Promise<IUploaderResponse>
  remove: (path: string) =>  Promise<boolean>
}
export interface IGenerateShortUrl {
  (uri: string,data: any): Promise<string>
}

export interface ICurrentAccount  {
  _id: string
  firstName: string
  lastName: string
  roleLevel: number
  roleGroupId: string
}
export interface IValidateMobileNumber {
  (mobileNumber: string): string|null
}