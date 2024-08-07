import { useEffect } from 'react'
import { useSocket } from '@/providers/socket.provider'
import { useUsersStore } from '@/store/users'
import { Message } from '@/api/messages/types'
import { useQueryClient } from 'react-query'
import { messageKeys } from '@/api/messages'

export const useSocketMessages = () => {
  const socket = useSocket()
  const queryClient = useQueryClient()
  const { users, addUsers } = useUsersStore()

  useEffect(() => {
    if (!socket) return

    const handleMessage = (data: Message) => {
      if (users?.length) {
        addUsers(
          users
            .filter((user) => user.id !== socket.id)
            .map((user) => ({
              ...user,
              ...(user.id === data.senderId && {
                lastMessage: data.text,
                lastMessageTime: data.createdAt,
              }),
            }))
            .sort(
              (a, b) => new Date(b?.lastMessageTime || '').getTime() - new Date(a?.lastMessageTime || '').getTime(),
            ),
        )
      }

      queryClient.invalidateQueries(messageKeys.fetchMessages())
    }

    socket.on('message', handleMessage)

    return () => {
      socket.off('message', handleMessage)
    }
  }, [socket, users, addUsers])
}
