import { ethers } from 'ethers'

export function getProvider() {
  return new ethers.JsonRpcProvider('http://127.0.0.1:8545/')
}
