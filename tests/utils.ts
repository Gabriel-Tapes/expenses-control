import Decimal from 'decimal.js'
import { Category } from '@/models/category'
import { Expense } from '@/models/expense'
import { Gain } from '@/models/gain'
import { User } from '@/models/user'
import { type NextRequest } from 'next/server'

export const user = new User({
  name: 'joe',
  lastName: 'doe',
  email: 'joe.doe@exemple.com',
  password: '12345678'
})

export const category = new Category({ name: 'test' })

export const gain = new Gain({ owner: user, value: new Decimal(700) })

export const expense = new Expense({
  owner: user,
  category,
  description: 'test expense',
  cost: new Decimal(25)
})

export const req = {
  headers: new Headers()
} as NextRequest
