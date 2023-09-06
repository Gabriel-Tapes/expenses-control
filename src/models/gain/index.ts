import Decimal from 'decimal.js'
import { randomUUID as v4 } from 'node:crypto'
import { type User } from '@/models/user'

export interface GainProps {
  id: string
  owner: User
  value: Decimal
  createdAt: Date
  updatedAt: Date
}

export class Gain {
  private props: GainProps

  get id() {
    return this.props.id
  }

  get owner() {
    return this.props.owner
  }

  get value() {
    return this.props.value
  }

  set value(newValue: Decimal) {
    if (newValue.isNegative())
      throw new Error(
        'Gain value field error: the value field must be positive'
      )

    this.props.value = new Decimal(newValue)
    this.props.updatedAt = new Date()
  }

  get createdAt() {
    return this.props.createdAt
  }

  set updatedAt(newDate: Date) {
    if (newDate < this.createdAt || newDate > new Date())
      throw new Error('Invalid date')

    this.props.updatedAt = this.updatedAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  constructor(
    { owner, value }: Omit<GainProps, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    if (value.isNegative())
      throw new Error(
        'Gain value field error: the value field must be positive'
      )

    this.props = {
      id: id || v4(),
      owner,
      value,
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? new Date()
    }
  }

  toJSON() {
    return {
      id: this.props.id,
      owner: this.props.owner.toJSON(),
      value: this.props.value,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString()
    }
  }
}
