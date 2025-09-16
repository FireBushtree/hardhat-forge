import type { Account } from '@hardhat-forge/shared'
import { hexStringToBytes } from '@nomicfoundation/hardhat-utils/hex'
import type { EdrNetworkAccountsConfig } from 'hardhat/types/config'
import { addr } from 'micro-eth-signer'
import { isDefaultEdrNetworkHDAccountsConfig } from '../../../../node_modules/hardhat/src/internal/builtin-plugins/network-manager/edr/edr-provider'
import { normalizeEdrNetworkAccountsConfig } from '../../../../node_modules/hardhat/src/internal/builtin-plugins/network-manager/edr/utils/convert-to-edr'

/**
 * copy from node plugin
 * @param config
 * @returns
 */
export async function formatEdrNetworkConfigAccounts(
  config: EdrNetworkAccountsConfig,
): Promise<Array<Account>> {
  const accounts = await normalizeEdrNetworkAccountsConfig(config)

  if (accounts.length === 0) {
    return []
  }

  const formattedAccounts: Array<Account> = []
  const isDefault =
    !Array.isArray(config) &&
    (await isDefaultEdrNetworkHDAccountsConfig(config))

  const accountPrefix = (index: number) => `Account #${index}:`
  const privateKeyPrefix = 'Private Key:'

  let maxPrefixLength = accountPrefix(accounts.length - 1).length
  if (isDefault && privateKeyPrefix.length > maxPrefixLength) {
    maxPrefixLength = privateKeyPrefix.length
  }

  for (const [index, account] of accounts.entries()) {
    const address = addr
      .fromPrivateKey(hexStringToBytes(await account.privateKey.getHexString()))
      .toLowerCase()
    const balance = (BigInt(account.balance) / 10n ** 18n).toString(10)

    const accountObj: Account = {
      index,
      address,
      balance,
      symbol: 'ETH',
    }

    if (isDefault === true) {
      accountObj.privateKey = await account.privateKey.getHexString()
    }

    formattedAccounts.push(accountObj)
  }

  return formattedAccounts
}
