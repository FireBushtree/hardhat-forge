import { Navigate, type RouteObject, useRoutes } from 'react-router'
import DefaultLayout from './layouts/Default'
import Accounts from './pages/Accounts'
import Blocks from './pages/Blocks'
import Contracts from './pages/Contracts'
import Events from './pages/Events'
import Transactions from './pages/Transactions'

const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <Navigate to={'accounts'} />,
      },
      {
        path: 'accounts',
        element: <Accounts />,
      },
      {
        path: 'contracts',
        element: <Contracts />,
      },
      {
        path: 'events',
        element: <Events />,
      },
      {
        path: 'transactions',
        element: <Transactions />,
      },
      {
        path: 'blocks',
        element: <Blocks />,
      },
    ],
  },
]

export default function AppRoutes() {
  const routes = useRoutes(routeConfig)
  return routes
}
