import Decimal from 'decimal.js'
import { Expense } from '.'
import { User } from '../user'
import { Category } from '../category'

describe('model expense tests', () => {
  const owner = new User({
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple',
    password: '12345678'
  })

  const category = new Category({ name: 'test' })
  it('should be able to create an Expense', () => {
    const expense = new Expense({
      owner,
      category,
      description: 'burger',
      cost: new Decimal(13),
      paidAt: new Date()
    })

    expect(expense).toBeInstanceOf(Expense)
    expect(expense.description).toBe('burger')
  })

  it('should not be able to create an expense with description field blank', () => {
    expect(() => {
      return new Expense({
        owner,
        category,
        description: '',
        cost: new Decimal(13)
      })
    }).toThrow()
  })

  it('should not be able to create an expense with cost field negative', () => {
    expect(() => {
      return new Expense({
        owner,
        category,
        description: 'burger',
        cost: new Decimal(-13),
        paidAt: new Date()
      })
    }).toThrow()
  })

  it('should convert to JSON', () => {
    const expense = new Expense({
      owner,
      category,
      description: 'test expense',
      cost: new Decimal(20)
    })

    expect(expense.toJSON()).toEqual({
      id: expense.id,
      owner: expense.owner.toJSON(),
      category: expense.category.toJSON(),
      description: expense.description,
      cost: expense.cost.toString(),
      paidAt: expense.paidAt,
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString()
    })
  })
})
