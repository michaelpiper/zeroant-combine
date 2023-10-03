import { type ErrorMessage, type SuccessData } from './response.type.js'
export interface IErrorFormat {
  msg: string
  param: string
}
export interface ICustomErrorResponse {
  errorMessage: ErrorMessage
  errorCode: string
  errorDescription: string
  statusCode: number
}
export interface ISuccessResponse {
  status: number
  message: string
  data?: SuccessData
}
export interface IErrorResponse {
  errorCode: string
  errorDescription: string
  errorMessage: ErrorMessage
}
