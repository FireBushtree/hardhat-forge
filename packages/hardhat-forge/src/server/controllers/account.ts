import { getAccounts } from '../services/account'
import type { CreateApiParams } from '../types/api'
import { Response } from '../utils/response'

export function createAccountsApi(props: CreateApiParams) {
  const { app, hre } = props
  // API 接口
  app.get('/api/accounts', async (_req, res) => {
    const accounts = await getAccounts(hre)
    res.json(Response.Success(accounts))
  })
}
