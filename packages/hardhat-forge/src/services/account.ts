import type { EdrNetworkAccountsConfig } from 'hardhat/types/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre'
import { formatEdrNetworkConfigAccounts } from '../utils/account'

export async function getAccounts(hre: HardhatRuntimeEnvironment) {
  const { networkConfig } = await hre.network.connect({})
  return formatEdrNetworkConfigAccounts(
    networkConfig.accounts as EdrNetworkAccountsConfig,
  )
}
