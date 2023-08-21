import { Expense } from '@/models/expense'
import { IExpensesRepository } from '../IExpensesRepository'
import { query } from '@/infra/database'
import { EditExpenseDTO } from '@/types/DTO'

export class PostgresExpensesRepository implements IExpensesRepository {
  async createExpense(expense: Expense): Promise<void> {
    await query(
      `
        INSERT INTO expenses 
        (id, ownerId, categoryId, description, cost, paidAt, createdAt, updatedAt) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      {
        values: [
          expense.id,
          expense.ownerId,
          expense.categoryId,
          expense.description,
          expense.cost,
          expense.paidAt,
          expense.createdAt,
          expense.updatedAt
        ]
      }
    )
  }
  async getExpense(
    ownerId: string,
    expenseId: string
  ): Promise<Expense | null> {
    const { rows } = await query(
      `
        SELECT categoryId, description, cost, createdAt, updatedAt 
        FROM expenses 
        WHERE ownerId = $1 and id = $2
      `,
      { values: [ownerId, expenseId] }
    )

    if (rows.length === 0) return null

    const {
      categoryid: categoryId,
      description,
      cost,
      paidat: paidAt,
      createdat: createdAt,
      updatedat: updatedAt
    } = rows[0]

    return new Expense(
      { ownerId, categoryId, description, cost, paidAt },
      expenseId,
      createdAt,
      updatedAt
    )
  }
  async getAllExpenses(ownerId: string): Promise<Expense[]> {
    const { rows } = await query(
      `
        SELECT id, categoryId, description, cost, paidAt, createdAt, updatedAt 
        FROM expenses
        WHERE ownerId = $1
        ORDER BY createdAt
      `,
      { values: [ownerId] }
    )

    return rows.map(
      ({
        id,
        categoryid: categoryId,
        description,
        cost,
        paidat: paidAt,
        createdat: createdAt,
        updatedat: updatedAt
      }) =>
        new Expense(
          { ownerId, categoryId, description, cost, paidAt },
          id,
          createdAt,
          updatedAt
        )
    )
  }
  async getExpensesByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Expense[]> {
    const { rows } = await query(
      `
        SELECT id, categoryId, description, cost, paidAt, createdAt, updatedAt
        FROM expenses
        WHERE
          ownerId = $1 AND
          createdAt BETWEEN $2 AND $3
        ORDER BY createdAt DESC
      `,
      { values: [ownerId, startDate, endDate] }
    )

    return rows.map(
      ({
        id,
        categoryid: categoryId,
        description,
        cost,
        paidat: paidAt,
        createdat: createdAt,
        updatedat: updatedAt
      }) =>
        new Expense(
          { ownerId, categoryId, description, cost, paidAt },
          id,
          createdAt,
          updatedAt
        )
    )
  }
  async editExpense({
    id,
    ownerId,
    categoryId,
    description,
    cost,
    paidAt
  }: EditExpenseDTO): Promise<Expense | null> {
    const { rows } = await query(
      `
        UPDATE expenses
        SET 
          categoryId = COALESCE($3, categoryId), 
          description = COALESCE($4, description), 
          cost = COALESCE($5, cost),
          paidAt = COALESCE($6, paidAt),
          updatedAt = NOW()
        WHERE id = $1 and ownerId = $2
        RETURNING categoryId, description, cost, paidAt, createdAt, updatedAt
      `,
      {
        values: [id, ownerId, categoryId, description, cost, paidAt]
      }
    )

    if (rows.length === 0) return null

    const {
      categoryid: editedCategoryId,
      editedDescription,
      editedCost,
      paidat: editedPaidAt,
      createdat: createdAt,
      updatedat: updatedAt
    } = rows[0]

    return new Expense(
      {
        ownerId,
        categoryId: editedCategoryId,
        description: editedDescription,
        cost: editedCost,
        paidAt: editedPaidAt
      },
      id,
      createdAt,
      updatedAt
    )
  }
  async deleteExpense(ownerId: string, expenseId: string): Promise<number> {
    const { rows } = await query(
      'DELETE FROM expenses WHERE ownerId = $1 and id = $2 RETURNING 1',
      {
        values: [ownerId, expenseId]
      }
    )

    if (rows.length === 0) return 1

    return 0
  }
}
