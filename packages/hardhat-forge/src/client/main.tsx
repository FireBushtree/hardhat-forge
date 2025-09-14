import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import AppRoutes from './routes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
)
