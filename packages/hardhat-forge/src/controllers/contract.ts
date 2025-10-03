import { getContracts } from '../services/contract'
import type { CreateApiParams } from '../types/api'
import { Response } from '../utils/response'

/**
 * 1. artifacts includes all compiled contracts
 * 2. ignition/deployments/chain-31337 includes deployed contracts
 * 3. match them
 */
export function createContractsApi(props: CreateApiParams) {
  const { app, hre } = props
  app.get('/api/contracts', async (_req, res) => {
    res.json(Response.Success(getContracts(hre)))
  })
}
