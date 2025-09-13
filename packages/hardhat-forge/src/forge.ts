import path from 'node:path'
import type { EdrNetworkAccountsConfig } from 'hardhat/types/config'
import type { NewTaskActionFunction } from 'hardhat/types/tasks'
import { formatEdrNetworkConfigAccounts } from './helpers'
import { createServer } from './server'

export type ForgeActionArguments = {
  port?: number
}

const forgeAction: NewTaskActionFunction<ForgeActionArguments> = async (
  args,
  hre,
) => {
  const { networkConfig } = await hre.network.connect({})
  const accounts = await formatEdrNetworkConfigAccounts(
    networkConfig.accounts as EdrNetworkAccountsConfig,
  )

  createServer(args, hre)
}

export default forgeAction
