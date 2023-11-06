import { GameField } from '@/components/field'
import { auth } from '@/lib/auth'
import { ButtonAuth } from './button-auth'
import { ButtonLogout } from './button-logout'
import { ButtonNewGame } from './button-new-game'

export default async function Home() {
  const session = await auth()

  return (
    <>
      <GameField
        field={[
          { coords: { x: 1, y: 1 }, item: 'tic' },
          { coords: { x: 0, y: 1 }, item: 'tic' },
          { coords: { x: 1, y: 2 }, item: 'tic' },
          { coords: { x: 0, y: 0 }, item: 'tac' },
          { coords: { x: 0, y: 2 }, item: 'tac' },
          { coords: { x: 2, y: 1 }, item: 'tac' },
        ]}
        disabled={true}
      />

      {session?.user ? (
        <div className="w-full max-w-xs">
          <div className="flex flex-col gap-3">
            <div className="rounded-lg bg-gray-100">
              <div className="pointer-events-none flex select-none items-center">
                <div className="m-2 flex h-10 w-10 items-center justify-center rounded-md border-blue-700 bg-gray-300 uppercase text-gray-600">
                  {session.user.username.slice(0, 2)}
                </div>
                <p className="m-1 font-bold leading-5 text-gray-700">
                  {session.user.username}
                  <br />
                  <small className="text-gray-500">Your username</small>
                </p>
              </div>

              <ButtonNewGame />
            </div>

            <ButtonLogout />
          </div>
        </div>
      ) : (
        <ButtonAuth />
      )}
    </>
  )
}
