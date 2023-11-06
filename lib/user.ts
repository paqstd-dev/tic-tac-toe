'use server'

import bcrypt from 'bcrypt'
import { z } from 'zod'
import { signIn } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface UserProps {
  username: string
  password: string
}

const signInFormSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export const signInFormAction = async (prevState: string | undefined, form: FormData) => {
  const parsed = signInFormSchema.safeParse({
    username: form.get('username'),
    password: form.get('password'),
  })

  if (!parsed.success) {
    return parsed.error.errors[0].message
  }

  try {
    await signIn('credentials', parsed.data)
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
      return 'Username or password is incorrect! Try again.'
    }

    throw error
  }
}

export const getUser = async ({ username, password }: UserProps) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user || !user.password) {
    return null
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return null
  }

  return { id: user.id, username }
}

const signUpFormSchema = z
  .object({
    username: z.string().min(4, 'Username must be more than 4 characters'),
    password: z.string().min(8, 'Password must be more than 8 characters'),
    password2: z.string().min(8, 'Confirm Password must be more than 8 characters'),
  })
  .superRefine(({ password, password2 }, ctx) => {
    if (password !== password2) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match!',
      })
    }
  })

export const signUpFormAction = async (prevState: any, form: FormData) => {
  const parsed = signUpFormSchema.safeParse({
    username: form.get('username'),
    password: form.get('password'),
    password2: form.get('password2'),
  })

  if (!parsed.success) {
    return parsed.error.errors[0].message
  }

  const { username, password } = parsed.data

  const checkUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (checkUsername) {
    return 'Username already exist! Try to authorize or enter other username.'
  }

  const hashPassword = await bcrypt.hash(password, 8)
  const user = await prisma.user.create({
    data: {
      username,
      password: hashPassword,
    },
  })

  if (!user) {
    return 'Failed to create user! Try again later.'
  }

  await signIn('credentials', { username, password })
}
