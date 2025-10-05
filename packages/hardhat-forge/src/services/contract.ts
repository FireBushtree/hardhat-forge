import fs from 'node:fs'
import path from 'node:path'
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre'
import {
  DEPLOYED_ADDRESSES_JSON,
  DOT_JSON,
  HEX_PREFIX,
  UTF8,
} from '../constants/string'
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

  const contracts: Contract[] = []

  // get all compiled contracts
  walkDir(artifactsContractsPath, ({ entry, fullPath }) => {
    if (entry.name.endsWith(DOT_JSON)) {
      const artifact = JSON.parse(fs.readFileSync(fullPath, UTF8))
      const { contractName } = artifact
      if (contractName) {
        contracts.push({
          name: contractName,
          isDeployed: false,
          artifact,
        })
      }
    }
  })

  const localDeployedContractObj: Record<string, string> = JSON.parse(
    fs.readFileSync(deployedAddressesJson, { encoding: UTF8 }),
  )
  const client = await hre.network.connect({
    network: 'localhost',
  })
  const verifyList = []

  for (const [key, value] of Object.entries(localDeployedContractObj)) {
    verifyList.push(
      client.provider
        .request({
          method: 'eth_getCode',
          params: [value, 'latest'],
        })
        .then((code) => {
          if (code !== HEX_PREFIX) {
            const contractPath = path.join(
              localDeploymentsChainPath,
              'artifacts',
              `${key}${DOT_JSON}`,
            )

            const contractInfo = JSON.parse(
              fs.readFileSync(contractPath, { encoding: UTF8 }),
            )

            const target = contracts.find(
              (item) => item.artifact.sourceName === contractInfo.sourceName,
            )

            if (target) {
              target.isDeployed = true
            }
          }
        }),
    )
  }

  await Promise.all(verifyList)

  return {
    contracts,
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
