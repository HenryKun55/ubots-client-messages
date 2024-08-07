import { render, act } from '@testing-library/react'
import { vi, Mock } from 'vitest'
import { useSocket } from '@/providers/socket.provider'
import { useUsersStore } from '@/store/users'
import { useQueryClient } from 'react-query'
import { useSocketMessages } from '@/hooks/use-socket-messages'

vi.mock('@/providers/socket.provider')
vi.mock('@/store/users')
vi.mock('react-query')

const TestComponent = () => {
  useSocketMessages()
  return null
}

describe('useSocketMessages', () => {
  let mockSocket: { on: Mock; off: Mock }
  const mockAddUsers = vi.fn()
  const mockInvalidateQueries = vi.fn()

  beforeEach(() => {
    mockSocket = { on: vi.fn(), off: vi.fn() }
    //@ts-ignore
    vi.mocked(useSocket).mockReturnValue(mockSocket)
    vi.mocked(useUsersStore).mockReturnValue({
      users: [],
      addUsers: mockAddUsers,
    })
    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    } as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should sets up and tears down socket listeners', () => {
    render(<TestComponent />)

    expect(mockSocket.on).toHaveBeenCalledTimes(1)
    expect(mockSocket.on).toHaveBeenCalledWith('message', expect.any(Function))

    act(() => {
      render(null)
    })

    expect(mockSocket.off).not.toHaveBeenCalled()
    expect(mockSocket.off).not.toHaveBeenCalledWith('message', expect.any(Function))
  })

  test('should handles incoming messages and updates users', () => {
    const mockMessage = {
      senderId: 'user1',
      text: 'Hello',
      createdAt: new Date().toISOString(),
    }

    const mockUsers = [
      { id: 'user1', name: 'Alice', lastMessage: '', lastMessageTime: '' },
      { id: 'user2', name: 'Bob', lastMessage: '', lastMessageTime: '' },
    ]

    vi.mocked(useUsersStore).mockReturnValue({
      users: mockUsers,
      addUsers: mockAddUsers,
    })

    render(<TestComponent />)

    expect(mockSocket.on).toHaveBeenCalled()
    expect(mockSocket.on).toHaveBeenCalledWith('message', expect.any(Function))

    const messageHandler = mockSocket.on.mock.calls[0][1]
    act(() => {
      messageHandler(mockMessage)
    })

    expect(mockAddUsers).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'user1',
          lastMessage: 'Hello',
          lastMessageTime: mockMessage.createdAt,
        }),
      ]),
    )

    expect(mockInvalidateQueries).toHaveBeenCalledTimes(1)
  })
})
