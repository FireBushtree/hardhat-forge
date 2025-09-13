import type { EdrNetworkAccountsConfig } from 'hardhat/types/config'
import type { NewTaskActionFunction } from 'hardhat/types/tasks'
import { formatEdrNetworkConfigAccounts } from './helpers'

type ForgeActionArguments = {}

const forgeAction: NewTaskActionFunction<ForgeActionArguments> = async (
  args,
  hre,
) => {
  const { networkConfig } = await hre.network.connect({})
  const accounts = await formatEdrNetworkConfigAccounts(
    networkConfig.accounts as EdrNetworkAccountsConfig,
  )

  console.log(accounts)
}

export default forgeAction
