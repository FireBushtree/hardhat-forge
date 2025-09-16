import { ResponseCode } from '@hardhat-forge/shared'

export const Response = {
  Success(data: unknown, message?: string) {
    return {
      code: ResponseCode.Success,
      data,
      message,
      timestamp: new Date().toISOString(),
    }
  },
  Fail(data: unknown, message: string) {},
}
