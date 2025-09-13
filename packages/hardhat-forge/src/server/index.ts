import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre'
import type { ForgeActionArguments } from '../forge'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function createServer(
  args: ForgeActionArguments,
  hre: HardhatRuntimeEnvironment,
) {
  const app = express()
  const PORT = args.port ? parseInt(args.port, 10) : 3001

  // 静态文件服务 - 提供 dist 目录下的静态文件
  const distPath = path.join(__dirname, './dist')

  // 添加静态文件中间件
  app.use(
    express.static(distPath, {
      etag: false,
      maxAge: 0,
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')
      },
    }),
  )

  // 添加 JSON 解析中间件
  app.use(express.json())

  // API 接口
  app.get('/api/hello', async (_req, res) => {
    try {
      const { networkConfig } = await hre.network.connect({})
      res.json({
        message: 'Hello from Express API!',
        network: networkConfig.chainId || 'unknown',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })
  // 默认路由 - 首页
  app.get('/', (_req, res) => {
    const indexPath = path.join(distPath, 'index.html')
    res.sendFile(indexPath)
  })

  // SPA 路由支持 - 处理所有其他路由
  app.use((_req, res) => {
    const indexPath = path.join(distPath, 'index.html')
    res.sendFile(indexPath)
  })

  app.listen(PORT, async () => {
    console.log(`🚀 Express server is running at http://localhost:${PORT}`)
  })
}
