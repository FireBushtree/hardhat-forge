import fs from 'node:fs'
import path from 'node:path'
import { DOT_JSON, UTF8 } from '../constants/string'
import type { CreateApiParams } from '../types/api'
import type { Contract } from '../types/contract'
import { Response } from '../utils/response'

export function createContractsApi(props: CreateApiParams) {
  const { app, hre } = props
  // API 接口
  app.get('/api/contracts', async (_req, res) => {
    const artifactsPath = path.join(hre.config.paths.artifacts, 'contracts')
    const contracts: Contract[] = []

    function walkDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          walkDir(fullPath)
        } else if (entry.name.endsWith(DOT_JSON)) {
          const artifact = JSON.parse(fs.readFileSync(fullPath, UTF8))
          const contractName = path.basename(entry.name, DOT_JSON)
          contracts.push({
            name: contractName,
            artifact,
          })
        }
      }
    }

    walkDir(artifactsPath)

    res.json(Response.Success(contracts))
  })
}
