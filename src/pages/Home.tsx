import { cn } from '@/lib/utils'
import { useSocket } from '@/providers/socket.provider'
import { Messages } from '@/components/messages'
import { Nav } from '@/components/nav'
import { useSocketUsers } from '@/hooks/use-socket-users'
import { useSocketMessages } from '@/hooks/use-socket-messages'

export const Home = () => {
  const socket = useSocket()

  useSocketUsers()
  useSocketMessages()

  if (!socket) return 'Loading ...'

  return (
    <main className={cn('h-dvh w-dvw flex flex-col overflow-hidden', 'md:grid md:grid-cols-[300px_1fr]')}>
      <Nav />
      <Messages />
    </main>
  )
}
