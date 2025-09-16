import { Boxes, ChevronLeft, ChevronRight, Clock, Hash } from 'lucide-react'
import { useEffect, useState } from 'react'
import NumberBadge from '@/components/common/NumberBadge'
import { getProvider } from '@/services/chain'

interface Block {
  number: number
  hash: string | null
  parentHash: string
  timestamp: number
  transactionCount: number
  gasUsed: bigint
  gasLimit: bigint
}

export default function Blocks() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [latestBlockNumber, setLatestBlockNumber] = useState(0)
  const [loading, setLoading] = useState(false)

  const BLOCKS_PER_PAGE = 10

  useEffect(() => {
    getBlockList(1)
  }, [])

  const getTotalPages = () => {
    return Math.ceil(latestBlockNumber / BLOCKS_PER_PAGE)
  }

  const getBlockRange = (page: number, latestBlockNumber: number) => {
    const endBlock = latestBlockNumber - (page - 1) * BLOCKS_PER_PAGE
    const startBlock = Math.max(0, endBlock - BLOCKS_PER_PAGE + 1)
    return { startBlock, endBlock }
  }

  async function getBlockList(page: number) {
    setLoading(true)
    try {
      const provider = getProvider()
      const latest = await provider.getBlockNumber()
      setLatestBlockNumber(latest)

      const { startBlock, endBlock } = getBlockRange(page, latest)
      const blocksToFetch = Math.min(BLOCKS_PER_PAGE, endBlock - startBlock + 1)

      if (blocksToFetch <= 0) {
        setBlocks([])
        return
      }

      const blockPromises = []
      for (let i = 0; i < blocksToFetch; i++) {
        const blockNumber = endBlock - i
        if (blockNumber >= 0) {
          blockPromises.push(provider.getBlock(blockNumber))
        }
      }

      const fetchedBlocks = await Promise.all(blockPromises)
      const formattedBlocks: Block[] = fetchedBlocks
        .filter((block) => block !== null)
        .map((block) => ({
          number: block.number,
          hash: block.hash,
          parentHash: block.parentHash,
          timestamp: block.timestamp,
          transactionCount: block.transactions.length,
          gasUsed: block.gasUsed,
          gasLimit: block.gasLimit,
        }))

      setBlocks(formattedBlocks)
      setCurrentPage(page)
    } catch (error) {
      console.error('Failed to fetch blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= getTotalPages()) {
      getBlockList(page)
    }
  }

  const formatHash = (hash: string | null) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const totalPages = getTotalPages()

  return (
    <div className="min-h-screen bg-black pt-10 px-6">
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
                        {block.transactionCount}
                      </div>
                      <div className="text-sm text-gray-400">transactions</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {latestBlockNumber > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 pb-8">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-gray-800/50 hover:bg-purple-400/20 border border-gray-700/50 hover:border-purple-400/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} className="text-gray-400" />
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-purple-400 text-black'
                            : 'bg-gray-800/50 text-gray-400 hover:bg-purple-400/20 hover:text-purple-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-gray-800/50 hover:bg-purple-400/20 border border-gray-700/50 hover:border-purple-400/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </div>
            )}

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
