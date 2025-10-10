import { useCallback, useState } from 'react'
import request from '@/services/request'

export interface ContractArtifact {
  contractName?: string
  sourceName?: string
  abi?: unknown[]
  bytecode?: string
  deployedBytecode?: string
  [key: string]: unknown
}

export interface ContractItem {
  name: string
  isDeployed: boolean
  artifact: ContractArtifact
}

interface ContractsResponse {
  contracts: ContractItem[]
}

export function useContracts() {
  const [contracts, setContracts] = useState<ContractItem[]>([])
  const [loading, setLoading] = useState(false)

  const getContracts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await request<ContractsResponse>('/api/contracts')
      setContracts(data.contracts || [])
    } catch (error) {
      console.error('Failed to fetch contracts:', error)
      setContracts([])
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    contracts,
    loading,
    getContracts,
  }
}
