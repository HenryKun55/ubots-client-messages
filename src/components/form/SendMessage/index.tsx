import { Send } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSocket } from '@/providers/socket.provider'
import { useCreateMessage } from '@/api/messages'
import { useUsersStore } from '@/store/users'
import schema, { FormDataInput, FormDataOutput } from './validator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const SendMessageForm = () => {
  const socket = useSocket()
  const { mutateAsync } = useCreateMessage()
  const { theUserSelectedToTalk } = useUsersStore()

  const { register, handleSubmit, reset } = useForm<FormDataInput>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormDataOutput) => {
    if (!socket) return
    mutateAsync({
      text: data.text,
      senderId: socket.id!,
      receiverId: theUserSelectedToTalk?.id!,
    })
    reset()
  }

  return (
    <div className="border-t bg-muted/20 p-4">
      <form className="flex items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('text')}
          id="message"
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
        />
        <Button type="submit">
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  )
}
