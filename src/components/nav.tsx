import { cn } from '@/lib/utils'
import { useUsersStore } from '@/store/users'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

export const Nav = () => {
  const { theUser, users, theUserSelectedToTalk, addTheUserSelectedToTalk } = useUsersStore()

  return (
    <nav className="border-r bg-muted/20 p-4">
      {theUser && (
        <div className="gap-5 flex place-items-center mb-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={theUser.avatar} alt="Avatar" />
            <AvatarFallback>
              {theUser.name.split(' ')[0].charAt(0) + theUser.name.split(' ')[0].charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-base">
            Hi <strong>{theUser.name}</strong>
          </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Messages</h1>
      </div>
      <div className={cn('mt-4 space-y-2 max-h-44 overflow-y-auto', 'md:max-h-full')}>
        {users?.map((user) => (
          <div
            key={user.id}
            className={cn(
              'flex items-center gap-3 rounded-lg bg-accent p-2 text-accent-foreground cursor-default',
              theUserSelectedToTalk?.id === user.id && 'border border-gray-500',
            )}
            onClick={() => addTheUserSelectedToTalk(user)}
          >
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={user.avatar} alt="Avatar" />
              <AvatarFallback>{user.name.split(' ')[0].charAt(0) + user.name.split(' ')[0].charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              {user.lastMessage && user.lastMessageTime && (
                <>
                  <p className="text-xs text-muted-foreground">{user.lastMessage}</p>
                  <div className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(
                      new Date(user.lastMessageTime),
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </nav>
  )
}
