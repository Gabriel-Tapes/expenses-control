import { randomUUID as v4 } from 'node:crypto'

export interface CategoryProps {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export class Category {
  private props: CategoryProps

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  set name(newName: string) {
    if (!newName) throw new Error('Invalid blank new category name')
    this.props.name = newName
    this.props.updatedAt = new Date()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  constructor(
    { name }: Omit<CategoryProps, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    if (!name) throw new Error('Invalid blank category name')

    this.props = {
      name,
      id: id ?? v4(),
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? new Date()
    }
  }

  toJSON() {
    return {
      id: this.props.id,
      name: this.props.name,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString()
    }
  }
}
