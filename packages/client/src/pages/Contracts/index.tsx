import { CheckCircle2, FileCode2, ScrollText, Timer } from 'lucide-react'
import { useEffect } from 'react'
import NumberBadge from '@/components/common/NumberBadge'
import { useContracts } from '@/hooks/useContracts'

export default function Contracts() {
  const { contracts, loading, getContracts } = useContracts()

  useEffect(() => {
    getContracts()
  }, [getContracts])

  const formatBytecodePreview = (bytecode?: string) => {
    if (!bytecode) return 'N/A'
    const previewLength = 74
    if (bytecode.length <= previewLength) {
      return bytecode
    }
    return `${bytecode.slice(0, previewLength)}...`
  }

  return (
    <div className="pt-10 px-6 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <ScrollText className="text-purple-400" size={28} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CONTRACTS
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Explore compiled artifacts and deployment status for your Hardhat
            contracts
          </p>
          {contracts.length > 0 && !loading && (
            <p className="text-gray-500 text-xs mt-1">
              Showing {contracts.length} contract
              {contracts.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading contracts...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {contracts.map((contract, index) => (
                <div
                  key={`${contract.name}-${index}`}
                  className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-6 backdrop-blur-xl hover:border-purple-400/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <NumberBadge number={index + 1} />
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          {contract.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <FileCode2 size={16} />
                          <span>
                            {contract.artifact?.sourceName || 'Unknown source'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {contract.isDeployed ? (
                        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-400/10 border border-green-400/30 text-green-300 text-sm font-medium">
                          <CheckCircle2 size={16} />
                          <span>Deployed</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-200 text-sm font-medium">
                          <Timer size={16} />
                          <span>Not deployed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        Contract Name
                      </div>
                      <div className="text-sm text-gray-300">
                        {contract.artifact?.contractName || contract.name}
                      </div>
                    </div>

                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        ABI Entries
                      </div>
                      <div className="text-sm text-gray-300">
                        {Array.isArray(contract.artifact?.abi)
                          ? contract.artifact.abi.length
                          : 'N/A'}
                      </div>
                    </div>

                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        Bytecode Size
                      </div>
                      <div className="text-sm text-gray-300">
                        {typeof contract.artifact?.bytecode === 'string'
                          ? `${contract.artifact.bytecode.length} chars`
                          : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="block text-sm font-medium text-gray-300 mb-2">
                      Bytecode Preview
                    </div>
                    <code className="block text-xs text-gray-400 bg-black/40 border border-gray-700/50 rounded-lg p-3 font-mono break-all">
                      {formatBytecodePreview(contract.artifact?.bytecode)}
                    </code>
                  </div>
                </div>
              ))}
            </div>

            {contracts.length === 0 && (
              <div className="text-center py-16">
                <ScrollText className="mx-auto text-gray-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No contracts found
                </h3>
                <p className="text-gray-500">
                  Compile your Hardhat contracts or deploy them locally to view
                  details here.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
