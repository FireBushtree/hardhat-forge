import type { Account as AccountType } from '@hardhat-forge/shared'
import { useEffect, useState } from 'react'
import request from '@/services/request'

export default function Account() {
  const [accounts, setAccounts] = useState<AccountType[]>([])

  useEffect(() => {
    getAccounts()
  }, [])

  console.log(accounts)

  async function getAccounts() {
    const accounts = await request<AccountType[]>('/api/accounts')
    setAccounts(accounts)
  }

  return <div>account</div>
}
