import { query } from '@/infra/database'
import { Expense } from '@/models/expense'

export async function createExpense(expense: Expense): Promise<void> {
  await query(
    `
      INSERT INTO expenses 
      (id, ownerId, categoryId, description, cost, paidAt, createdAt, updatedAt) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    {
      values: [
        expense.id,
        expense.owner.id,
        expense.category.id,
        expense.description,
        expense.cost.toString(),
        expense.paidAt,
        expense.createdAt,
        expense.updatedAt
      ]
    }
  )
}
