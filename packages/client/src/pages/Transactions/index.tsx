import { ArrowRightLeft } from 'lucide-react'
import { useEffect } from 'react'
import { useTransactionsList } from '@/hooks/useTransactionsList'

export default function Transactions() {
  const { transactions, loading, getTransactions } = useTransactionsList()

  useEffect(() => {
    getTransactions()
  }, [])

  const formatValue = (value: bigint) => {
    const eth = Number(value) / 1e18
    return eth.toFixed(6)
  }

  const formatGasPrice = (gasPrice: bigint | null) => {
    if (!gasPrice) return 'N/A'
    const gwei = Number(gasPrice) / 1e9
    return `${gwei.toFixed(2)} Gwei`
  }

  return (
    <div className="pt-10 px-6 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <ArrowRightLeft className="text-purple-400" size={28} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TRANSACTIONS
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Browse recent blockchain transactions and transfer data
          </p>
          {transactions.length > 0 && (
            <p className="text-gray-500 text-xs mt-1">
              Showing latest {transactions.length} transactions
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading transactions...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {transactions.map((tx) => (
                <div
                  key={tx.hash}
                  className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-6 backdrop-blur-xl hover:border-purple-400/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="text-white font-semibold text-lg font-mono break-all">
                          {tx.hash}
                        </h3>
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <span>Block #{tx.blockNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-400">
                        {formatValue(tx.value)} ETH
                      </div>
                      <div className="text-sm text-gray-400">value</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        From → To
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400">From:</span>
                          <code className="font-mono">{tx.from}</code>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-red-400">To:</span>
                          <code className="font-mono">
                            {tx.to ? tx.to : 'Contract Creation'}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        Gas Details
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>Limit: {tx.gasLimit.toLocaleString()}</div>
                        <div>
                          Price:{' '}
                          {formatGasPrice(tx.gasPrice || tx.maxFeePerGas)}
                        </div>
                        <div>Nonce: {tx.nonce}</div>
                      </div>
                    </div>
                  </div>

                  {tx.data && tx.data !== '0x' && (
                    <div className="mt-4">
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        Input Data
                      </div>
                      <code className="block text-xs text-gray-400 bg-black/40 border border-gray-700/50 rounded-lg p-3 font-mono break-all">
                        {tx.data.slice(0, 100)}
                        {tx.data.length > 100 ? '...' : ''}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {transactions.length === 0 && !loading && (
              <div className="text-center py-16">
                <ArrowRightLeft
                  className="mx-auto text-gray-600 mb-4"
                  size={48}
                />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-500">
                  No transactions have been made recently or the blockchain is
                  empty.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
