import { create } from 'zustand'

export type User = {
  id: string
  name: string
  avatar: string
  lastMessage?: string
  lastMessageTime?: string
}

interface UsersState {
  theUser?: User
  theUserSelectedToTalk?: User
  users?: User[]
  addTheUser: (user?: User) => void
  addUsers: (users?: User[]) => void
  addTheUserSelectedToTalk: (user?: User) => void
}

export const useUsersStore = create<UsersState>((set) => ({
  theUser: undefined,
  theUserSelectedToTalk: undefined,
  users: [],
  addTheUser: (user) =>
    set((state) => ({
      ...state,
      theUser: user,
    })),
  addUsers: (users) =>
    set((state) => ({
      ...state,
      users,
    })),
  addTheUserSelectedToTalk: (user) =>
    set((state) => ({
      ...state,
      theUserSelectedToTalk: user,
    })),
}))
