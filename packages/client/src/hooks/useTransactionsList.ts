import type { TransactionResponse } from 'ethers'
import { useState } from 'react'
import { getProvider } from '@/services/chain'

export function useTransactionsList() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [loading, setLoading] = useState(false)

  async function getTransactions() {
    setLoading(true)
    try {
      const provider = getProvider()
      const latestBlockNumber = await provider.getBlockNumber()

      // 如果没有区块，直接返回
      if (latestBlockNumber < 0) {
        setTransactions([])
        return
      }

      const allTransactions: TransactionResponse[] = []
      const maxTransactions = 100

      // 从最新区块开始向前扫描，直到找到100个交易或扫描完所有区块
      for (
        let i = 0;
        i <= latestBlockNumber && allTransactions.length < maxTransactions;
        i++
      ) {
        const blockNumber = latestBlockNumber - i

        try {
          const block = await provider.getBlock(blockNumber, true)
          if (block?.transactions) {
            for (const txHash of block.transactions) {
              if (allTransactions.length < maxTransactions) {
                const transaction = await block.getTransaction(txHash)
                allTransactions.push(transaction)
              }
            }
          }
        } catch (blockError) {
          console.warn(`Failed to fetch block ${blockNumber}:`, blockError)
        }
      }

      // 按区块号和nonce排序（最新的在前）
      allTransactions.sort((a, b) => {
        if (a.blockNumber !== b.blockNumber) {
          return (b.blockNumber || 0) - (a.blockNumber || 0)
        }
        return b.nonce - a.nonce
      })

      setTransactions(allTransactions)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  return {
    transactions,
    loading,
    getTransactions,
  }
}
