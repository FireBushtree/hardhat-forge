import type { CreateApiParams } from '../types/api'

export function createAccountsApi(props: CreateApiParams) {
  const { app, hre } = props
  // API 接口
  app.get('/api/hello', async (_req, res) => {
    try {
      const { networkConfig } = await hre.network.connect({})
      res.json({
        message: 'Hello from Express API111!',
        network: networkConfig.chainId || 'unknown',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })
}
