import Decimal from 'decimal.js'
import { randomUUID as v4 } from 'node:crypto'

export interface GainProps {
  id: string
  ownerId: string
  value: Decimal
  createdAt: Date
  updatedAt: Date
}

export class Gain {
  private props: GainProps

  get id() {
    return this.props.id
  }

  get ownerId() {
    return this.props.ownerId
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
    { ownerId, value }: Omit<GainProps, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    if (!ownerId || value.isNegative())
      throw new Error(
        'Gain value field error: the value field must be positive'
      )

    this.props = {
      id: id || v4(),
      ownerId,
      value,
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? new Date()
    }
  }
}
