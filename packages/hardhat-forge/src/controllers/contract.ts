import fs from 'node:fs'
import path from 'node:path'
import hardhat from 'hardhat'
import { DOT_JSON, UTF8 } from '../constants/string'
import type { CreateApiParams } from '../types/api'
import type { Contract } from '../types/contract'
import { Response } from '../utils/response'

export function createContractsApi(props: CreateApiParams) {
  const { app, hre } = props
  app.get('/api/contracts', async (_req, res) => {
    const artifactsPath = path.join(hre.config.paths.artifacts, 'contracts')
    const ignitionPath = path.join(hre.config.paths.root, 'ignition')
    const deploymentsPath = path.join(ignitionPath, 'deployments')
    const localDeploymentsPath = path.join(deploymentsPath, 'chain-31337')

    const contracts: Contract[] = []
    const localDeployedContracts: Contract[] = []

    function walkDir(dir: string, list: Contract[]) {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          walkDir(fullPath, list)
        } else if (entry.name.endsWith(DOT_JSON)) {
          const artifact = JSON.parse(fs.readFileSync(fullPath, UTF8))
          const { contractName } = artifact
          if (contractName) {
            list.push({
              name: contractName,
              artifact,
            })
          }
        }
      }
    }

    walkDir(artifactsPath, contracts)
    walkDir(localDeploymentsPath, localDeployedContracts)

    // TODO judge contract deployed
    const client = await hre.network.connect({
      network: 'localhost',
    })
    const code = await client.provider.request({
      method: 'eth_getCode',
      params: ['0x5FbDB2315678afecb367f032d93F642f64180aa3', 'latest'],
    })

    res.json(
      Response.Success({
        contracts,
        localDeployedContracts,
        code,
      }),
    )
  })
}
