export enum ResponseCode {
  Success,
  Fail,
}

export interface ResponseData<T> {
  code: ResponseCode
  data: T
  message?: string
  timestamp: string
}
