import { render, act } from '@testing-library/react'
import { vi, Mock } from 'vitest'
import { useSocket } from '@/providers/socket.provider'
import { useFetchMessages } from '@/api/messages'
import { useUsersStore } from '@/store/users'
import { User } from '@/store/users'
import { useSocketUsers } from '@/hooks/use-socket-users'

vi.mock('@/providers/socket.provider')
vi.mock('@/api/messages')
vi.mock('@/store/users')

const TestComponent = () => {
  useSocketUsers()
  return null
}

describe('useSocketUsers', () => {
  let mockSocket: { on: Mock; off: Mock }
  const mockAddUsers = vi.fn()
  const mockAddTheUser = vi.fn()
  const mockAddTheUserSelectedToTalk = vi.fn()

  const mockMessages = [{ senderId: 'user1', text: 'Hello', createdAt: new Date().toISOString() }]

  beforeEach(() => {
    mockSocket = { on: vi.fn(), off: vi.fn() }
    //@ts-ignore
    vi.mocked(useSocket).mockReturnValue(mockSocket)
    //@ts-ignore
    vi.mocked(useFetchMessages).mockReturnValue({ data: mockMessages })
    vi.mocked(useUsersStore).mockReturnValue({
      theUserSelectedToTalk: undefined,
      addTheUserSelectedToTalk: mockAddTheUserSelectedToTalk,
      addUsers: mockAddUsers,
      addTheUser: mockAddTheUser,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should sets up and tears down socket listeners', () => {
    render(<TestComponent />)

    expect(mockSocket.on).toHaveBeenCalledTimes(1)
    expect(mockSocket.on).toHaveBeenCalledWith('users', expect.any(Function))

    act(() => {
      render(null)
    })

    expect(mockSocket.off).not.toHaveBeenCalledTimes(1)
    expect(mockSocket.off).not.toHaveBeenCalledWith('users', expect.any(Function))
  })

  test('should handles incoming users data and updates the store', () => {
    const mockUsers: User[] = [
      { id: 'user1', name: 'Alice', avatar: 'avatar1.png' },
      { id: 'user2', name: 'Bob', avatar: 'avatar2.png' },
    ]

    render(<TestComponent />)

    act(() => {
      const handleUsers = mockSocket.on.mock.calls[0][1]
      handleUsers(mockUsers)
    })

    expect(mockAddUsers).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'user1',
          lastMessage: 'Hello',
          lastMessageTime: mockMessages[0].createdAt,
        }),
      ]),
    )
    expect(mockAddTheUser).toHaveBeenCalledTimes(1)
    expect(mockAddTheUserSelectedToTalk).toHaveBeenCalledWith(undefined)
  })

  test('should handles case where no users are returned', () => {
    render(<TestComponent />)

    act(() => {
      const handleUsers = mockSocket.on.mock.calls[0][1]
      handleUsers([])
    })

    expect(mockAddTheUserSelectedToTalk).toHaveBeenCalledWith(undefined)
  })
})
