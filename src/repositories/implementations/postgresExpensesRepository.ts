import Decimal from 'decimal.js'
import { Expense } from '@/models/expense'
import { User } from '@/models/user'
import { Category } from '@/models/category'
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
  async getOwner(ownerId: string): Promise<User | null> {
    const { rows } = await query(
      `
        SELECT json_build_object(
          'name', name,
          'lastName', lastname,
          'email', email,
          'password', password,
          'createdAt', createdat,
          'updatedAt', updatedat
        ) as user
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      { values: [ownerId] }
    )

    if (rows.length === 0) return null

    const { name, lastName, email, password, createdAt, updatedAt } =
      rows[0].user

    return new User(
      { name, lastName, email, password },
      ownerId,
      new Date(createdAt),
      new Date(updatedAt)
    )
  }
  async getCategory(categoryId: string): Promise<Category | null> {
    const { rows } = await query(
      `
        SELECT json_build_object(
          'name', name,
          'createdAt', createdat,
          'updatedAt', updatedat
        ) AS category
        FROM categories
        WHERE id = $1
        LIMIT 1
      `,
      { values: [categoryId] }
    )

    if (rows.length === 0) return null

    const { name, createdAt, updatedAt } = rows[0].category

    return new Category(
      { name },
      categoryId,
      new Date(createdAt),
      new Date(updatedAt)
    )
  }
  async getExpense(
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
  async getAllExpenses(ownerId: string): Promise<Expense[]> {
    const { rows } = await query(
      `
        SELECT
          json_build_object(
            'id', expenses.id,
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
        WHERE expenses.ownerId = $1
        ORDER BY expenses.createdAt DESC
      `,
      { values: [ownerId] }
    )

    return rows.map(({ expense }) => {
      const {
        id,
        owner,
        category,
        description,
        cost,
        paidAt,
        createdAt,
        updatedAt
      } = expense
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
            {
              name: category.name
            },
            category.id,
            new Date(category.createdAt),
            new Date(category.updatedAt)
          ),
          description,
          cost: new Decimal(cost),
          paidAt: paidAt ? new Date(paidAt) : null
        },
        id,
        new Date(createdAt),
        new Date(updatedAt)
      )
    })
  }
  async getExpensesByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Expense[]> {
    const { rows } = await query(
      `
        SELECT
          json_build_object(
            'id', expenses.id,
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
        WHERE 
          expenses.ownerId = $1 and
          expenses.createdAt BETWEEN $2 and $3
        ORDER BY expenses.createdAt DESC
      `,
      { values: [ownerId, startDate, endDate] }
    )

    return rows.map(({ expense }) => {
      const {
        id,
        owner,
        category,
        description,
        cost,
        paidAt,
        createdAt,
        updatedAt
      } = expense
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
            {
              name: category.name
            },
            category.id,
            new Date(category.createdAt),
            new Date(category.updatedAt)
          ),
          description,
          cost: new Decimal(cost),
          paidAt: paidAt ? new Date(paidAt) : null
        },
        id,
        new Date(createdAt),
        new Date(updatedAt)
      )
    })
  }
  async getExpensesByCategory(
    ownerId: string,
    categoryId: string
  ): Promise<Expense[]> {
    const { rows } = await query(
      `
        SELECT
          json_build_object(
            'id', expenses.id,
            'owner', json_build_object(
              'name', users.name,
              'lastName', users.lastname,
              'email', users.email,
              'password', users.password,
              'createdAt', users.createdat,
              'updatedAt', users.updatedat
            ),
            'category', json_build_object(
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
        WHERE 
          expenses.ownerid = $1 and
          expenses.categoryid = $2
        ORDER BY expenses.createdAt DESC
      `,
      { values: [ownerId, categoryId] }
    )

    return rows.map(({ expense }) => {
      const {
        id,
        owner,
        category,
        description,
        cost,
        paidAt,
        createdAt,
        updatedAt
      } = expense
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
            {
              name: category.name
            },
            categoryId,
            new Date(category.createdAt),
            new Date(category.updatedAt)
          ),
          description,
          cost: new Decimal(cost),
          paidAt: paidAt ? new Date(paidAt) : null
        },
        id,
        new Date(createdAt),
        new Date(updatedAt)
      )
    })
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
