import {
  ArrowRightLeft,
  Boxes,
  FileCode,
  Search,
  Wallet,
  Zap,
} from 'lucide-react'
import { Link, useLocation } from 'react-router'

const NAV_ITEMS = [
  { path: '/accounts', label: 'ACCOUNTS', icon: Wallet },
  { path: '/blocks', label: 'BLOCKS', icon: Boxes },
  { path: '/transactions', label: 'TRANSACTIONS', icon: ArrowRightLeft },
  { path: '/contracts', label: 'CONTRACTS', icon: FileCode },
  { path: '/events', label: 'EVENTS', icon: Zap },
]

export default function Header() {
  const location = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          <nav className="flex items-center space-x-10">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              const IconComponent = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 transition-all duration-300 text-sm font-normal group"
                >
                  <IconComponent
                    size={18}
                    className={`transition-colors duration-300 ${
                      isActive
                        ? 'text-purple-400'
                        : 'text-gray-400 group-hover:text-purple-400'
                    }`}
                  />
                  <span
                    className={`relative transition-all duration-300 ${
                      isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {item.label}
                      </div>
                    )}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="relative">
            <input
              type="text"
              placeholder="Search blocks or transactions..."
              className="bg-gray-900/50 border border-gray-700/50 rounded-full px-5 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-400/50 focus:bg-gray-900/80 transition-all duration-300 w-72"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
