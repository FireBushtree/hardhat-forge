import fs from 'node:fs'
import path from 'node:path'
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre'
import { DEPLOYED_ADDRESSES_JSON, DOT_JSON, UTF8 } from '../constants/string'
import type { Contract } from '../types/contract'
import { getArtifactsPath, getIgnitionDeploymentsPath } from '../utils/path'

/**
 * 1. artifacts includes all compiled contracts
 * 2. ignition/deployments/chain-31337 includes deployed contracts
 * 3. match them
 */
export async function getContracts(hre: HardhatRuntimeEnvironment) {
  const artifactsContractsPath = path.join(getArtifactsPath(hre), 'contracts')
  const localDeploymentsChainPath = path.join(
    getIgnitionDeploymentsPath(hre),
    'chain-31337',
  )

  const deployedAddressesJson = path.join(
    localDeploymentsChainPath,
    DEPLOYED_ADDRESSES_JSON,
  )

  const res = fs.readFileSync(deployedAddressesJson, { encoding: UTF8 })

  const contracts: Contract[] = []
  const localDeployedContracts: Contract[] = []

  // get all compiled contracts
  walkDir(artifactsContractsPath, ({ entry, fullPath }) => {
    if (entry.name.endsWith(DOT_JSON)) {
      const artifact = JSON.parse(fs.readFileSync(fullPath, UTF8))
      const { contractName } = artifact
      if (contractName) {
        contracts.push({
          name: contractName,
          artifact,
        })
      }
    }
  })
  // get all deployed contracts
  walkDir(deployedAddressesJson, () => {})

  // TODO judge contract deployed
  const client = await hre.network.connect({
    network: 'localhost',
  })
  const code = await client.provider.request({
    method: 'eth_getCode',
    params: ['0x5FbDB2315678afecb367f032d93F642f64180aa3', 'latest'],
  })

  return {
    contracts,
    localDeployedContracts,
    code,
  }
}

type WalkDirCallback = (val: {
  fullPath: string
  entry: fs.Dirent<string>
}) => void

function walkDir(dir: string, callback: WalkDirCallback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(fullPath, callback)
    } else {
      callback({
        fullPath,
        entry,
      })
    }
  }
}
