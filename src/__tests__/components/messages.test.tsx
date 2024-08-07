import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useSocket } from '@/providers/socket.provider'
import { useFetchMessages } from '@/api/messages'
import { useUsersStore } from '@/store/users'
import { Messages } from '@/components/messages'

vi.mock('@/providers/socket.provider')
vi.mock('@/api/messages')
vi.mock('@/store/users')

describe('Messages', () => {
  const mockRefetch = vi.fn()
  const mockSocket = { id: 'socket-id' }
  const mockUser = { id: 'user-id', name: 'John Doe' }
  const mockAddTheUserSelectedToTalk = vi.fn()

  beforeEach(() => {
    vi.mocked(useSocket).mockReturnValue(mockSocket as any)
    //@ts-ignore
    vi.mocked(useFetchMessages).mockReturnValue({ refetch: mockRefetch })
    vi.mocked(useUsersStore).mockReturnValue({
      theUserSelectedToTalk: null,
      addTheUserSelectedToTalk: mockAddTheUserSelectedToTalk,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should renders null when socket is not available', () => {
    vi.mocked(useSocket).mockReturnValue(null)
    render(<Messages />)
    expect(screen.queryByText('Welcome')).not.toBeInTheDocument()
  })

  test('should renders welcome message when there is no user selected to talk to', () => {
    render(<Messages />)
    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  test('should calls refetch when addTheUserSelectedToTalk changes', async () => {
    render(<Messages />)
    vi.mocked(useUsersStore).mockReturnValue({
      theUserSelectedToTalk: mockUser,
      addTheUserSelectedToTalk: mockAddTheUserSelectedToTalk,
    })
    mockAddTheUserSelectedToTalk()
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled()
    })
  })
})
