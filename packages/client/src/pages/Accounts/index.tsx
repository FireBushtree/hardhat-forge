import type { Account as AccountType } from '@hardhat-forge/shared'
import { AlertTriangle, Copy, Eye, EyeOff, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import NumberBadge from '@/components/common/NumberBadge'
import request from '@/services/request'

export default function Account() {
  const [accounts, setAccounts] = useState<AccountType[]>([])
  const [showPrivateKeys, setShowPrivateKeys] = useState<Set<number>>(new Set())
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    getAccounts()
  }, [])

  async function getAccounts() {
    const accounts = await request<AccountType[]>('/api/accounts')
    setAccounts(accounts)
  }

  const togglePrivateKey = (index: number) => {
    const newSet = new Set(showPrivateKeys)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setShowPrivateKeys(newSet)
  }

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      const newSet = new Set(copiedItems)
      newSet.add(key)
      setCopiedItems(newSet)
      setTimeout(() => {
        setCopiedItems((prev) => {
          const updated = new Set(prev)
          updated.delete(key)
          return updated
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-red-400" size={20} />
            <p className="text-red-300/80 text-sm">
              These accounts are for development purposes only. DO NOT use them
              on mainnet or with real funds.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Wallet className="text-purple-400" size={28} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ACCOUNTS
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Manage your development accounts and private keys
          </p>
        </div>

        <div className="grid gap-4">
          {accounts.map((account) => (
            <div
              key={account.index}
              className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-6 backdrop-blur-xl hover:border-purple-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <NumberBadge number={account.index} variant="purple" />
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      Account {account.index}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {account.balance}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {account.symbol}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor={`address-${account.index}`}
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <code
                      id={`address-${account.index}`}
                      className="flex-1 bg-black/40 border border-gray-700/50 rounded-lg px-4 py-3 text-sm text-gray-300 font-mono"
                    >
                      {account.address}
                    </code>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          account.address,
                          `address-${account.index}`,
                        )
                      }
                      className="p-3 bg-gray-800/50 hover:bg-purple-400/20 border border-gray-700/50 hover:border-purple-400/50 rounded-lg transition-all duration-200"
                      title="Copy address"
                    >
                      <Copy
                        size={16}
                        className={
                          copiedItems.has(`address-${account.index}`)
                            ? 'text-green-400'
                            : 'text-gray-400'
                        }
                      />
                    </button>
                  </div>
                </div>

                {account.privateKey && (
                  <div>
                    <label
                      htmlFor={`private-${account.index}`}
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Private Key
                    </label>
                    <div className="flex items-center space-x-2">
                      <code
                        id={`private-${account.index}`}
                        className="flex-1 bg-black/40 border border-gray-700/50 rounded-lg px-4 py-3 text-sm text-gray-300 font-mono"
                      >
                        {showPrivateKeys.has(account.index)
                          ? account.privateKey
                          : '•'.repeat(64)}
                      </code>
                      <button
                        type="button"
                        onClick={() => togglePrivateKey(account.index)}
                        className="p-3 bg-gray-800/50 hover:bg-purple-400/20 border border-gray-700/50 hover:border-purple-400/50 rounded-lg transition-all duration-200"
                        title={
                          showPrivateKeys.has(account.index)
                            ? 'Hide private key'
                            : 'Show private key'
                        }
                      >
                        {showPrivateKeys.has(account.index) ? (
                          <EyeOff size={16} className="text-gray-400" />
                        ) : (
                          <Eye size={16} className="text-gray-400" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            account.privateKey || '',
                            `private-${account.index}`,
                          )
                        }
                        className="p-3 bg-gray-800/50 hover:bg-purple-400/20 border border-gray-700/50 hover:border-purple-400/50 rounded-lg transition-all duration-200"
                        title="Copy private key"
                      >
                        <Copy
                          size={16}
                          className={
                            copiedItems.has(`private-${account.index}`)
                              ? 'text-green-400'
                              : 'text-gray-400'
                          }
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-16">
            <Wallet className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No accounts found
            </h3>
            <p className="text-gray-500">
              Check your Hardhat configuration to ensure accounts are properly
              set up.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
