import { type RouteObject, useRoutes } from 'react-router'
import DefaultLayout from './layouts/Default'
import Account from './pages/Account'
import Home from './pages/Home'

const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'account',
        element: <Account />,
      },
    ],
  },
]

export default function AppRoutes() {
  const routes = useRoutes(routeConfig)
  return routes
}
