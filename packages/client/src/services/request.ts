// api/request.ts
import { ResponseCode, type ResponseData } from '@hardhat-forge/shared'
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: '', // 你的后端地址
  timeout: 10000,
})

// 响应拦截器
instance.interceptors.response.use(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation> user judge
  (response: AxiosResponse<ResponseData<any>>) => {
    const res = response.data
    if (res.code === ResponseCode.Success) {
      return res.data
    } else {
      return Promise.reject(res.message)
    }
  },
  (error) => {
    return Promise.reject(error.message)
  },
)

// 封装请求方法
function request<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return instance(url, config)
}

export default request
