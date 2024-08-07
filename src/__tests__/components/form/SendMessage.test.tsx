import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useSocket } from '@/providers/socket.provider'
import { useCreateMessage } from '@/api/messages'
import { useUsersStore } from '@/store/users'
import { Socket } from 'socket.io-client'
import { SendMessageForm } from '@/components/form/SendMessage'

vi.mock('@/providers/socket.provider')
vi.mock('@/api/messages')
vi.mock('@/store/users')

type MockSocket = Partial<Socket> & { id: string }

describe('SendMessageForm', () => {
  const mockSocket: MockSocket = { id: 'socket-id' }
  const mockMutateAsync = vi.fn().mockResolvedValue({})
  const mockUser = { id: 'user-id' }

  beforeEach(() => {
    vi.mocked(useSocket).mockReturnValue(mockSocket as Socket)
    //@ts-ignore
    vi.mocked(useCreateMessage).mockReturnValue({ mutateAsync: mockMutateAsync })
    vi.mocked(useUsersStore).mockReturnValue({ theUserSelectedToTalk: mockUser })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should renders form with input and button', () => {
    render(<SendMessageForm />)
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  test('should submits the form with correct data', async () => {
    render(<SendMessageForm />)
    const input = screen.getByPlaceholderText('Type your message...')
    const button = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(input, { target: { value: 'Hello World!' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        text: 'Hello World!',
        senderId: 'socket-id',
        receiverId: 'user-id',
      })
    })
  })

  test('should resets the form after submission', async () => {
    render(<SendMessageForm />)
    const input = screen.getByPlaceholderText('Type your message...')
    const button = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(input, { target: { value: 'Hello World!' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  test('should not submit the form if socket is not available', () => {
    vi.mocked(useSocket).mockReturnValue(null)
    render(<SendMessageForm />)
    const input = screen.getByPlaceholderText('Type your message...')
    const button = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(input, { target: { value: 'Hello World!' } })
    fireEvent.click(button)

    expect(mockMutateAsync).not.toHaveBeenCalled()
  })
})
