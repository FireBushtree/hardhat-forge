import express from 'express'
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre'
import path from 'path'
import type { ForgeActionArguments } from '../forge'

const app = express()
const PORT = process.env.PORT || 3001

export function createServer(
  args: ForgeActionArguments,
  hre: HardhatRuntimeEnvironment,
) {
  // API 示例
  app.get('/api/hello', (_req, res) => {
    res.json({ message: 'Hello from Express API!' })
  })

  app.get('/', (_req, res) => {
    res.sendFile('../client/dist/index.html')
  })

  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`)
  })
}
