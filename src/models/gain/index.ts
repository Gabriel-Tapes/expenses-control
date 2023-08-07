import { randomUUID as v4 } from 'node:crypto'

export interface GainProps {
  id: string
  ownerId: string
  value: number
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

  set value(newValue: number) {
    if (newValue < 0)
      throw new Error(
        'Gain value field error: the value field must be positive'
      )

    this.props.value = newValue
    this.props.updatedAt = new Date()
  }

  get createdAt() {
    return this.props.createdAt
  }

  constructor(
    { ownerId, value }: Omit<GainProps, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    if (!ownerId || value < 0)
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
