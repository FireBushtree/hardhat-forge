import type { Block } from 'ethers'
import { useEffect, useState } from 'react'
import { getProvider } from '@/services/chain'

const BLOCKS_PER_PAGE = 10

export interface BlockListConfig {
  pageSize?: number
}

export function useBlockList(config?: BlockListConfig) {
  const pageSize = config?.pageSize || BLOCKS_PER_PAGE

  const [blocks, setBlocks] = useState<Block[]>([])
  const [latestBlockNumber, setLatestBlockNumber] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    init()
  }, [])

  const totalPages = Math.ceil(latestBlockNumber / pageSize)

  async function init() {
    const provider = getProvider()
    const latest = await provider.getBlockNumber()
    setLatestBlockNumber(latest)
  }

  const getBlockRange = (page: number, latestBlockNumber: number) => {
    const endBlock = latestBlockNumber - (page - 1) * pageSize
    const startBlock = Math.max(0, endBlock - pageSize + 1)
    return { startBlock, endBlock }
  }

  async function getBlocks(start: number) {
    setLoading(true)
    try {
      const provider = getProvider()
      const latest = await provider.getBlockNumber()

      const { startBlock, endBlock } = getBlockRange(start, latest)
      const blocksToFetch = Math.min(pageSize, endBlock - startBlock + 1)

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
      const formattedBlocks: Block[] = fetchedBlocks.filter(
        (block) => block !== null,
      )

      setBlocks(formattedBlocks)
    } finally {
      setLoading(false)
    }
  }

  return {
    blocks,
    totalPages,
    loading,
    latestBlockNumber,
    getBlocks,
  }
}
