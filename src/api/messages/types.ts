export type CreateMessageRequest = {
  text: string
  senderId: string
  receiverId: string
}

export type FetchMessagesResponse = Message[]

export type Message = {
  id: string
  text: string
  senderId: string
  receiverId: string
  createdAt: string
}
