import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { useUsersStore } from '@/store/users'
import { Nav } from '@/components/nav'

vi.mock('@/store/users')

describe('Nav', () => {
  const mockTheUser = { id: 'user-id', name: 'John Doe', avatar: 'avatar-url' }
  const mockUsers = [
    {
      id: 'user1',
      name: 'Alice',
      avatar: 'alice-avatar',
      lastMessage: 'Hello',
      lastMessageTime: '2023-08-07T12:34:56Z',
    },
    {
      id: 'user2',
      name: 'Bob',
      avatar: 'bob-avatar',
      lastMessage: 'Hi there',
      lastMessageTime: '2023-08-07T13:45:00Z',
    },
  ]
  const mockAddTheUserSelectedToTalk = vi.fn()
  const mockTheUserSelectedToTalk = mockUsers[0]

  beforeEach(() => {
    vi.mocked(useUsersStore).mockReturnValue({
      theUser: null,
      users: [],
      theUserSelectedToTalk: null,
      addTheUserSelectedToTalk: mockAddTheUserSelectedToTalk,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should renders correctly when no user is logged in', () => {
    render(<Nav />)
    expect(screen.queryByText('Hi')).not.toBeInTheDocument()
    expect(screen.getByText('Messages')).toBeInTheDocument()
  })

  test('should renders correctly when a user is logged in', () => {
    vi.mocked(useUsersStore).mockReturnValue({
      theUser: mockTheUser,
      users: [],
      theUserSelectedToTalk: null,
      addTheUserSelectedToTalk: mockAddTheUserSelectedToTalk,
    })
    render(<Nav />)
    expect(screen.getByText(mockTheUser.name)).toBeInTheDocument()
    expect(screen.getByText('Messages')).toBeInTheDocument()
  })

  test('should renders list of users', () => {
    vi.mocked(useUsersStore).mockReturnValue({
      theUser: mockTheUser,
      users: mockUsers,
      theUserSelectedToTalk: null,
      addTheUserSelectedToTalk: mockAddTheUserSelectedToTalk,
    })
    render(<Nav />)

    mockUsers.forEach((user) => {
      expect(screen.getByText(user.name)).toBeInTheDocument()
      expect(screen.getByText(user.lastMessage)).toBeInTheDocument()
      expect(
        screen.getByText(
          new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(
            new Date(user.lastMessageTime),
          ),
        ),
      ).toBeInTheDocument()
    })
  })

  test('should calls addTheUserSelectedToTalk when a user is clicked', () => {
    vi.mocked(useUsersStore).mockReturnValue({
      theUser: mockTheUser,
      users: mockUsers,
      theUserSelectedToTalk: mockTheUserSelectedToTalk,
      addTheUserSelectedToTalk: mockAddTheUserSelectedToTalk,
    })
    render(<Nav />)

    const userElement = screen.getByText(mockUsers[1].name)
    fireEvent.click(userElement)

    expect(mockAddTheUserSelectedToTalk).toHaveBeenCalledWith(mockUsers[1])
  })
})
