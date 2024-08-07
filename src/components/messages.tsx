import { useFetchMessages } from '@/api/messages'
import { useSocket } from '@/providers/socket.provider'
import { useUsersStore } from '@/store/users'
import { useEffect } from 'react'
import { SendMessageForm } from './form/SendMessage'
import { UserMessages } from './user-messages'

export const Messages = () => {
  const socket = useSocket()
  const { refetch } = useFetchMessages()
  const { theUserSelectedToTalk, addTheUserSelectedToTalk } = useUsersStore()

  useEffect(() => {
    refetch()
  }, [addTheUserSelectedToTalk])

  if (!socket) return null

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {theUserSelectedToTalk ? (
        <>
          <UserMessages />
          <SendMessageForm />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto p-4">
          <span className="text-3xl">Welcome</span>
        </div>
      )}
    </div>
  )
}
