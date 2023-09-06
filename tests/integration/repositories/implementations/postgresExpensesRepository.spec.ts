import { randomUUID } from 'node:crypto'
import Decimal from 'decimal.js'
import { Client } from 'pg'
import { Expense } from '@/models/expense'
import {
  PostgresCategoriesRepository,
  PostgresExpensesRepository,
  PostgresUsersRepository
} from '@/repositories/implementations'
import { getNewClient } from '@/infra/database'
import { user, category, expense } from '@tests/utils'

describe('PostgresExpensesRepository tests', () => {
  const expensesRepository = new PostgresExpensesRepository()

  let client: Client

  beforeAll(async () => {
    const usersRepository = new PostgresUsersRepository()
    const categoriesRepository = new PostgresCategoriesRepository()

    await usersRepository.createUser(user)

    await categoriesRepository.addCategory(category)

    client = await getNewClient()
  })

  afterEach(async () => {
    await client.query('DELETE FROM expenses')
  })

  afterAll(async () => {
    await client.query('DELETE FROM users')
    await client.query('DELETE FROM categories')

    await client.end()
  })

  it('should create an expense', async () => {
    await expensesRepository.createExpense(expense)

    const { rows } = await client.query(
      'SELECT description, cost FROM expenses WHERE id = $1 and ownerId = $2 LIMIT 1',
      [expense.id, expense.owner.id]
    )

    expect(rows.length).toBe(1)

    const { description, cost } = rows[0]

    expect(description).toEqual(expense.description)
    expect(cost).toEqual(expense.cost.toString())
  })

  it('should get owner', async () => {
    const owner = await expensesRepository.getOwner(user.id)

    expect(owner).toEqual(user)
  })

  it('should return null if a non-matching ownerId is provided', async () => {
    const owner = await expensesRepository.getOwner(randomUUID())

    expect(owner).toBeNull()
  })

  it('should get category', async () => {
    const gottenCategory = await expensesRepository.getCategory(category.id)

    expect(gottenCategory).toEqual(category)
  })

  it('should return null if a non-matching categoryId is provided', async () => {
    const gottenCategory = await expensesRepository.getCategory(randomUUID())

    expect(gottenCategory).toBeNull()
  })

  it('should get expense by id', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpense = await expensesRepository.getExpense(
      expense.owner.id,
      expense.id
    )

    expect(gottenExpense).toEqual(expense)
  })

  it('should return null if an non-matching id is provided', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpense = await expensesRepository.getExpense(
      expense.owner.id,
      randomUUID()
    )

    expect(gottenExpense).toBeNull()
  })

  it('should return null if an non-matching ownerId is provided', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpense = await expensesRepository.getExpense(
      randomUUID(),
      expense.id
    )

    expect(gottenExpense).toBeNull()
  })

  it('should get all expenses', async () => {
    await expensesRepository.createExpense(expense)
    await expensesRepository.createExpense(
      new Expense({
        owner: user,
        category,
        description: 'test expense 2',
        cost: new Decimal(20),
        paidAt: new Date()
      })
    )

    const gottenExpenses = await expensesRepository.getAllExpenses(
      expense.owner.id
    )

    expect(gottenExpenses.length).toBe(2)
    expect(gottenExpenses[1]).toEqual(expense)
  })

  it('should return an empty list if no expenses are found', async () => {
    const gottenExpenses = await expensesRepository.getAllExpenses(
      expense.owner.id
    )

    expect(gottenExpenses).toEqual([])
  })

  it('should get expenses by date period', async () => {
    await expensesRepository.createExpense(expense)
    await expensesRepository.createExpense(
      new Expense(
        {
          owner: user,
          category,
          description: 'test expense 2',
          cost: new Decimal(20),
          paidAt: new Date()
        },
        undefined,
        new Date(expense.createdAt.getTime() + 5)
      )
    )

    const gottenExpenses = await expensesRepository.getExpensesByDatePeriod(
      expense.owner.id,
      new Date(expense.createdAt.getTime() - 10),
      new Date(expense.createdAt.getTime() + 10)
    )

    expect(gottenExpenses.length).toBe(2)
    expect(gottenExpenses[1]).toEqual(expense)
  })

  it('should return an empty list if not expenses are found on date period', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpenses = await expensesRepository.getExpensesByDatePeriod(
      expense.owner.id,
      new Date(expense.createdAt.getTime() - 20),
      new Date(expense.createdAt.getTime() - 10)
    )

    expect(gottenExpenses.length).toBe(0)
  })

  it('should return an empty list if not expenses are found for ownerId', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpenses = await expensesRepository.getExpensesByDatePeriod(
      randomUUID(),
      new Date(expense.createdAt.getTime() - 10),
      new Date(expense.createdAt.getTime() + 10)
    )

    expect(gottenExpenses.length).toBe(0)
  })

  it('should get expenses by category', async () => {
    await expensesRepository.createExpense(expense)
    await expensesRepository.createExpense(
      new Expense({
        owner: user,
        category,
        description: 'test2 expense',
        cost: new Decimal(10),
        paidAt: new Date()
      })
    )

    const gottenExpenses = await expensesRepository.getExpensesByCategory(
      expense.owner.id,
      expense.category.id
    )

    expect(gottenExpenses.length).toBe(2)
    expect(gottenExpenses[1]).toEqual(expense)
  })

  it('should return empty list if not expenses are found for category', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpenses = await expensesRepository.getExpensesByCategory(
      user.id,
      randomUUID()
    )

    expect(gottenExpenses.length).toBe(0)
  })

  it('should edit an expense', async () => {
    await expensesRepository.createExpense(expense)

    const editedExpense = await expensesRepository.editExpense({
      id: expense.id,
      ownerId: expense.owner.id,
      description: 'edited description',
      cost: new Decimal(50),
      paidAt: new Date()
    })

    expect(editedExpense).toBeTruthy()
    expect(editedExpense?.categoryId).toEqual(expense.categoryId)
    expect(editedExpense?.description).toEqual('edited description')
    expect(editedExpense?.updatedAt).not.toEqual(expense.updatedAt)
  })

  it('should return null if a non-matching id is provided on editing', async () => {
    await expensesRepository.createExpense(expense)

    const editedExpense = await expensesRepository.editExpense({
      id: randomUUID(),
      ownerId: expense.owner.id,
      description: 'edited description',
      cost: new Decimal(50),
      paidAt: new Date()
    })

    expect(editedExpense).toBeNull()
  })

  it('should return null if a non-matching ownerId is provided on editing', async () => {
    await expensesRepository.createExpense(expense)

    const editedExpense = await expensesRepository.editExpense({
      id: expense.id,
      ownerId: randomUUID(),
      description: 'edited description',
      cost: new Decimal(50),
      paidAt: new Date()
    })

    expect(editedExpense).toBeNull()
  })

  it('should return 0 if expense found and deleted', async () => {
    await expensesRepository.createExpense(expense)

    const error = await expensesRepository.deleteExpense(
      expense.owner.id,
      expense.id
    )

    expect(error).toBe(0)
  })

  it('should return 1 if a non-matching id is provided on deleting', async () => {
    await expensesRepository.createExpense(expense)

    const error = await expensesRepository.deleteExpense(
      expense.owner.id,
      randomUUID()
    )

    expect(error).toBe(1)
  })

  it('should return 1 if a non-matching ownerId is provided on deleting', async () => {
    await expensesRepository.createExpense(expense)

    const error = await expensesRepository.deleteExpense(
      randomUUID(),
      expense.id
    )

    expect(error).toBe(1)
  })
})
