import { useFetchMessages } from '@/api/messages'
import { useSocket } from '@/providers/socket.provider'
import { User, useUsersStore } from '@/store/users'
import { useEffect } from 'react'

export const useSocketUsers = () => {
  const socket = useSocket()
  const { data: theMessages } = useFetchMessages()
  const { theUserSelectedToTalk, addTheUserSelectedToTalk, addTheUser, addUsers } = useUsersStore()

  useEffect(() => {
    if (socket) {
      const handleUsers = (data: User[]) => {
        if (!data.length) return addTheUserSelectedToTalk(undefined)
        if (data.length) {
          addUsers(
            data
              .filter((user) => user.id !== socket.id)
              .map((user) => ({
                ...user,
                lastMessage: theMessages?.reverse().find((message) => message.senderId === user.id)?.text || '',
                lastMessageTime:
                  theMessages?.reverse().find((message) => message.senderId === user.id)?.createdAt || '',
              }))
              .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()),
          )
        }
        addTheUser(data.find((user) => user.id === socket.id))
        if (!data.find((user) => user.id === theUserSelectedToTalk?.id)) addTheUserSelectedToTalk(undefined)
      }

      socket.on('users', handleUsers)

      return () => {
        socket.off('users', handleUsers)
      }
    }
  }, [socket, theMessages, addTheUserSelectedToTalk, addUsers, addTheUser, theUserSelectedToTalk])
}
