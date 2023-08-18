import Decimal from 'decimal.js'
import { Expense } from '.'

describe('model expense tests', () => {
  it('should be able to create an Expense', () => {
    const expense = new Expense({
      ownerId: 'owner',
      categoryId: 'foodId',
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
        ownerId: 'owner',
        categoryId: 'foodId',
        description: '',
        cost: new Decimal(13)
      })
    }).toThrow()
  })

  it('should not be able to create an expense with cost field negative', () => {
    expect(() => {
      return new Expense({
        ownerId: 'owner',
        categoryId: 'foodId',
        description: 'burger',
        cost: new Decimal(-13),
        paidAt: new Date()
      })
    }).toThrow()
  })
})
