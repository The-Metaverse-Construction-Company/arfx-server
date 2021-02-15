// import httpStatus from 'http-status'
/**
 * @extends Error
 */
class AppError extends Error {
  public httpStatus: any
  public errors = <any>[]
  // public status: any
  constructor({
    message, status, httpStatus
  }: any) {
    super(message);
    this.name = this.constructor.name;
    this.errors = [
      {
        msg: message
      }
    ]
    // this.status = status;
    this.httpStatus = httpStatus;
  }
}
export default AppError