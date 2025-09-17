import { Boxes, Clock, Hash } from 'lucide-react'
import { useEffect } from 'react'
import NumberBadge from '@/components/common/NumberBadge'
import { useBlockList } from '@/hooks/useBlockList'
import { formatHash, formatTimestamp } from '@/utils'

export default function Blocks() {
  const { loading, getBlocks, blocks } = useBlockList({ pageSize: 100 })

  useEffect(() => {
    getBlocks(1)
  }, [])

  return (
    <div className="pt-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Boxes className="text-purple-400" size={28} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              BLOCKS
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Browse blockchain blocks and transaction data
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading blocks...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {blocks.map((block) => (
                <div
                  key={block.number}
                  className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-6 backdrop-blur-xl hover:border-purple-400/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <NumberBadge number={block.number} />
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          Block {block.number}
                        </h3>
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <Clock size={14} />
                          <span>{formatTimestamp(block.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">
                        {block.transactions.length}
                      </div>
                      <div className="text-sm text-gray-400">transactions</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        Block Hash
                      </div>
                      <div className="flex items-center space-x-2">
                        <Hash size={16} className="text-gray-400" />
                        <code className="text-sm text-gray-300 font-mono">
                          {formatHash(block.hash)}
                        </code>
                      </div>
                    </div>

                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        Parent Hash
                      </div>
                      <div className="flex items-center space-x-2">
                        <Hash size={16} className="text-gray-400" />
                        <code className="text-sm text-gray-300 font-mono">
                          {formatHash(block.parentHash)}
                        </code>
                      </div>
                    </div>

                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        Gas Used
                      </div>
                      <div className="text-sm text-gray-300">
                        {block.gasUsed.toLocaleString()} /{' '}
                        {block.gasLimit.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {blocks.length === 0 && !loading && (
              <div className="text-center py-16">
                <Boxes className="mx-auto text-gray-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No blocks found
                </h3>
                <p className="text-gray-500">
                  The blockchain may be empty or still initializing.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
