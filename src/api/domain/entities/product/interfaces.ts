import {
  IGeneralEntityProperties
} from '../../interfaces/index'

export type IProdutBody = {
  name: string // some internal name
  title: string // title of the scene
  description: string // description of the scene
  discountPercentage: number // discount of the scene/product
  price: number // price of the scene. float
  published: boolean // toggle if it will show it portal or not.
}

export type IProductEntity = IProdutBody & IGeneralEntityProperties & {
  sceneURL: string // url of the product or the scene,
}