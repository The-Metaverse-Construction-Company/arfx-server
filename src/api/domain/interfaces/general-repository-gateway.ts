// interfaces for 
export interface IAggregatePagination<T> {
  data: T[]
  pages: number
  total: number
}
export type IAggregatePaginationResponse<T> = IAggregatePagination<T>
export interface IPaginationParameters {
  limitTo?: number
  startAt?: number
}
export interface IPaginationQueryParams extends IPaginationParameters {
  limitTo?: number
  searchText?: string
  sortBy?: ISortBy | ISortBy[]
}
export interface IStateChangeData<T> {
  newData: T
  previousData?: T
  localStreamId?: string
}
export interface IStateCallback<T> {
  (state: string|number, data: IStateChangeData<T>, key?: string) : void
}
export interface IStateDidChangedListener {
  state?: string|null,
  callback: IStateCallback<any>,
}
interface ISortBy {
  fieldName: string
  status: number
}
type IRepositoryGatewayData<T>  = Omit<Partial<T>, '_id' | 'id' | 'createdAt'>
type IRespositoryGatewayQuery<T> = Partial<Record<keyof T, any>>
export interface IGeneralRepositoryGateway<T> {
  findAll (queryParams?: IRespositoryGatewayQuery<T>, paginationQuery?: IPaginationParameters, project?: Partial<Record<keyof T, 1|0>>): Promise<T[]>
  insertOne (data: T): Promise<T>
  insertMany (data: T[]): Promise<T[]>
  findById (id: string): Promise<T>
  findOne (query: Partial<T>, projection?: Partial<Record<keyof T, 1|0>>): Promise<T>
  updateById (id: string, data: IRepositoryGatewayData<T>): Promise<T>
  updateOne (query: IRespositoryGatewayQuery<T>, data: IRepositoryGatewayData<T>): Promise<T>
  updateMany (query: IRespositoryGatewayQuery<T>, data: IRepositoryGatewayData<T>): Promise<T[]>
  removeById (id: string): Promise<T>
  removeOne (query: IRespositoryGatewayQuery<T>): Promise<T>
}
export interface IGeneralPaginationListGateway<T> {
  getListWithPagination (filterQuery: IPaginationQueryParams): Promise<IAggregatePagination<T>>
}
export interface IGeneralListGateway<T> {
  getList (filterQuery: IPaginationQueryParams): Promise<T[]>
}
export interface IEventStreamer<T> {
  registerEvent(event: T, data: any): void
  watchTransactionStream(streamId: string, message: any): Promise<boolean|{status: boolean, messages: any[], completed: boolean}>
  waitTransactionResponse(data: any, states: Array<number|string>, timeoutMilis: number): Promise<any>
}
export interface IStateListener<T> {
  stateDidChanged(state: number|string, data: IStateChangeData<T>): void
  stateWillChange(state: number|string, data: IStateChangeData<T>): void
}