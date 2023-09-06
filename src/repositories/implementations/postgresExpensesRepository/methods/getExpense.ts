import Decimal from 'decimal.js'
import { query } from '@/infra/database'
import { Category } from '@/models/category'
import { Expense } from '@/models/expense'
import { User } from '@/models/user'

export async function getExpense(
  ownerId: string,
  expenseId: string
): Promise<Expense | null> {
  const { rows } = await query(
    `
      SELECT
        json_build_object(
          'owner', json_build_object(
            'name', users.name,
            'lastName', users.lastname,
            'email', users.email,
            'password', users.password,
            'createdAt', users.createdat,
            'updatedAt', users.updatedat
          ),
          'category', json_build_object(
            'id', categories.id,
            'name', categories.name,
            'createdAt', categories.createdat,
            'updatedAt', categories.updatedat
          ),
          'description', expenses.description,
          'cost', expenses.cost,
          'paidAt', expenses.paidat,
          'createdAt', expenses.createdat,
          'updatedAt', expenses.updatedat
        ) as expense
      FROM expenses
      INNER JOIN users
        ON users.id = expenses.ownerid
      INNER JOIN categories
        ON categories.id = expenses.categoryid
      WHERE expenses.ownerid = $1 and expenses.id = $2
      LIMIT 1
    `,
    { values: [ownerId, expenseId] }
  )

  if (rows.length === 0) return null

  const { owner, category, description, cost, paidAt, createdAt, updatedAt } =
    rows[0].expense

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
        category.id,
        new Date(category.createdAt),
        new Date(category.updatedAt)
      ),
      description,
      cost: new Decimal(cost),
      paidAt: paidAt ? new Date(paidAt) : null
    },
    expenseId,
    new Date(createdAt),
    new Date(updatedAt)
  )
}
