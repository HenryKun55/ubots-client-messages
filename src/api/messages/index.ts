import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CreateMessageRequest, FetchMessagesResponse } from './types'
import api from '../api'
import { useSocket } from '@/providers/socket.provider'

const endpoints = {
  createMessage: () => 'messages',
  fetchMessages: (socketId: string) => `messages/${socketId}`,
}

export const messageKeys = {
  all: ['messages'] as const,
  createMessages: () => [...messageKeys.all, 'createMessage'] as const,
  createMessage: () => [...messageKeys.createMessages()] as const,
  fetchMessagess: () => [...messageKeys.all, 'fetchMessages'] as const,
  fetchMessages: () => [...messageKeys.fetchMessagess()] as const,
}

const messagesApi = {
  useCreateMessage: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (input: CreateMessageRequest) => {
        const response = await api.post<CreateMessageRequest>(endpoints.createMessage(), input)
        return response
      },
      onSuccess: () => queryClient.invalidateQueries(messageKeys.fetchMessages()),
    })
  },
  useFetchMessages: () => {
    const socket = useSocket()
    return useQuery({
      queryKey: messageKeys.fetchMessages(),
      queryFn: async () => {
        const response = await api.get<FetchMessagesResponse>(endpoints.fetchMessages(socket?.id!))
        return response.data
      },
    })
  },
}

export const { useCreateMessage, useFetchMessages } = messagesApi
