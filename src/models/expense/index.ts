import Decimal from 'decimal.js'
import { randomUUID as v4 } from 'node:crypto'
import { type Category } from '@/models/category'
import { type User } from '@/models/user'

export interface ExpenseProps {
  id: string
  owner: User
  category: Category
  description: string
  cost: Decimal
  paidAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export class Expense {
  private props: ExpenseProps

  get id() {
    return this.props.id
  }

  get owner() {
    return this.props.owner
  }

  get category() {
    return this.props.category
  }

  set categoryId(newCategory: Category) {
    this.props.category = newCategory
    this.props.updatedAt = new Date()
  }

  get description() {
    return this.props.description
  }

  set description(newDescription: string) {
    if (!newDescription)
      throw new Error(
        'Expense description error, the description field cannot be blank'
      )

    this.props.description = newDescription
    this.props.updatedAt = new Date()
  }

  get cost() {
    return this.props.cost
  }

  set cost(newCost: Decimal) {
    if (newCost.isNegative())
      throw new Error('Expense cost error, the cost field cannot be negative')

    this.props.cost = newCost
    this.props.updatedAt = new Date()
  }

  get paidAt() {
    return this.props.paidAt
  }

  set paidAt(newPaidAt: Date | null | undefined) {
    if (newPaidAt === undefined)
      throw new Error('Expense paidAt error, the paidAt field cannot be blank')

    this.props.paidAt = newPaidAt
    this.props.updatedAt = new Date()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  constructor(
    {
      owner,
      category,
      description,
      cost,
      paidAt = null
    }: Omit<ExpenseProps, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    if (!owner || !category || !description || cost.isNegative())
      throw new Error('Expense blank field error: all fields must be filled')

    this.props = {
      id: id ?? v4(),
      category,
      owner,
      description,
      cost,
      paidAt,
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? new Date()
    }
  }

  toJSON() {
    return {
      id: this.props.id,
      owner: this.props.owner.toJSON(),
      category: this.props.category.toJSON(),
      description: this.props.description,
      cost: this.props.cost.toString(),
      paidAt: this.props.paidAt,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString()
    }
  }
}
