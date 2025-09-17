import { Outlet } from 'react-router'
import Header from '../components/common/Header'

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="pt-16 pb-10">
        <Outlet />
      </main>
    </div>
  )
}
