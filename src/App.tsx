import { Home } from './pages/Home'
import { QueryProvider } from './providers/query.provider'
import { SocketProvider } from './providers/socket.provider'

export const App = () => {
  return (
    <SocketProvider>
      <QueryProvider>
        <Home />
      </QueryProvider>
    </SocketProvider>
  )
}
