export const formatHash = (hash: string | null) => {
  if (!hash) return 'N/A'
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

export const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString()
}
