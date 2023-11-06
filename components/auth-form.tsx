'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { DangerAlert } from '@/components/alert'
import { signInFormAction, signUpFormAction } from '@/lib/user'

interface FormComponent {
  onChangeFormType: () => void
}

const SignInForm = ({ onChangeFormType }: FormComponent) => {
  const { pending } = useFormStatus()
  const [error, action] = useFormState(signInFormAction, undefined)

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action={action}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                placeholder="Enter your username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                placeholder="Enter your password"
                name="password"
                type="password"
                autoComplete="password"
                required
                className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && <DangerAlert title="Error!" description={error} />}

          <div>
            <button
              type="submit"
              disabled={pending}
              className="w-full cursor-pointer rounded-md bg-blue-500 p-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          No account?{' '}
          <button
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            onClick={onChangeFormType}
          >
            Register now
          </button>
        </p>
      </div>
    </>
  )
}

const SignUpForm = ({ onChangeFormType }: FormComponent) => {
  const { pending } = useFormStatus()
  const [error, action] = useFormState(signUpFormAction, undefined)

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action={action}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                placeholder="Enter your username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                placeholder="Enter your password"
                name="password"
                type="password"
                autoComplete="password"
                required
                className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password2" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm password
            </label>
            <div className="mt-2">
              <input
                id="password"
                placeholder="Enter your password"
                name="password2"
                type="password"
                autoComplete="password"
                required
                className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && <DangerAlert title="Error!" description={error} />}

          <div>
            <button
              type="submit"
              disabled={pending}
              className="w-full cursor-pointer rounded-md bg-blue-500 p-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-600"
            >
              Create account
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have account?{' '}
          <button
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            onClick={onChangeFormType}
          >
            Sign in
          </button>
        </p>
      </div>
    </>
  )
}

export const AuthForm = () => {
  const [formType, setFormType] = useState<'signin' | 'signup'>('signin')

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      {formType === 'signin' ? (
        <SignInForm onChangeFormType={() => setFormType('signup')} />
      ) : (
        <SignUpForm onChangeFormType={() => setFormType('signin')} />
      )}
    </div>
  )
}
