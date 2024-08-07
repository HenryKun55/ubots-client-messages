import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SocketContext = createContext<Socket | null>(null)

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  useEffect(() => {
    if (!socket) {
      const newSocket = io(import.meta.env.VITE_API_URL)
      setSocket(newSocket)

      return () => {
        newSocket.disconnect()
      }
    }
  }, [])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
