import Decimal from 'decimal.js'
import { query } from '@/infra/database'
import { Category } from '@/models/category'
import { Expense } from '@/models/expense'
import { User } from '@/models/user'
import { EditExpenseDTO } from '@/types/DTO'

export async function editExpense({
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
      RETURNING
        (
          SELECT json_build_object(
            'name', users.name,
            'lastName', users.lastname,
            'email', users.email,
            'password', users.password,
            'createdAt', users.createdat,
            'updatedAt', users.updatedat
          )
          FROM users
        ) as owner,
        (
          SELECT json_build_object(
            'id', categories.id,
            'name', categories.name,
            'createdAt', categories.createdat,
            'updatedAt', categories.updatedat
          )
          FROM categories
        ) as category, 
        description, 
        cost, 
        paidAt, 
        createdAt, 
        updatedAt
    `,
    {
      values: [id, ownerId, categoryId, description, cost?.toString(), paidAt]
    }
  )

  if (rows.length === 0) return null

  const {
    owner,
    category,
    description: editedDescription,
    cost: editedCost,
    paidat: editedPaidAt,
    createdat: createdAt,
    updatedat: updatedAt
  } = rows[0]

  return new Expense(
    {
      owner: new User(
        {
          name: owner.name,
          lastName: owner.lastName,
          email: owner.email,
          password: owner.password
        },
        ownerId,
        new Date(owner.createdAt),
        new Date(owner.updatedAt)
      ),
      category: new Category(
        { name: category.name },
        categoryId ?? category.id,
        new Date(category.createdAt),
        new Date(category.updatedAt)
      ),
      description: editedDescription,
      cost: new Decimal(editedCost),
      paidAt: editedPaidAt ? new Date(editedPaidAt) : null
    },
    id,
    new Date(createdAt),
    new Date(updatedAt)
  )
}
