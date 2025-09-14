import { Outlet } from 'react-router'
import Header from '../components/common/Header'

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}
