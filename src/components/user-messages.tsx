import { useFetchMessages } from '@/api/messages'
import { cn } from '@/lib/utils'
import { useSocket } from '@/providers/socket.provider'
import { useUsersStore } from '@/store/users'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useEffect, useRef } from 'react'

export const UserMessages = () => {
  const socket = useSocket()
  const { data: theMessages } = useFetchMessages()
  const { theUserSelectedToTalk } = useUsersStore()

  const messagesRef = useRef<HTMLDivElement>(null)

  const theMessagesForUserSelected =
    theMessages?.filter(
      (message) => message.senderId === theUserSelectedToTalk?.id || message.receiverId === theUserSelectedToTalk?.id,
    ) || []

  useEffect(() => {
    if (!messagesRef) return
    messagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [theMessagesForUserSelected])

  if (!theUserSelectedToTalk || !socket) return null

  return (
    <>
      <header className="border-b bg-muted/20 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={theUserSelectedToTalk.avatar} alt="Avatar" />
            <AvatarFallback>{theUserSelectedToTalk.name}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{theUserSelectedToTalk.name}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-1">
          {theMessagesForUserSelected?.map((message) => {
            return (
              <>
                <div
                  key={message.id}
                  className={cn(
                    'flex flex-row w-max gap-2 rounded-full bg-muted px-4 py-2 text-sm',
                    message.senderId !== socket.id ? 'bg-primary text-primary-foreground' : 'ml-auto',
                  )}
                >
                  <span>{message.text}</span>

                  <span className={cn('ml-3', message.senderId !== socket.id ? 'text-zinc-400' : 'text-zinc-400')}>
                    {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(
                      new Date(message.createdAt),
                    )}
                  </span>
                </div>
                <div ref={messagesRef} />
              </>
            )
          })}
        </div>
      </div>
    </>
  )
}
