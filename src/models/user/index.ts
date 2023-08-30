import { randomUUID as v4 } from 'node:crypto'

export interface UserProps {
  id: string
  name: string
  lastName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export class User {
  private props: UserProps

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  set name(newName: string) {
    if (!newName)
      throw new Error('User name error, the name field cannot be blank')

    this.props.name = newName
    this.props.updatedAt = new Date()
  }

  get lastName() {
    return this.props.lastName
  }

  set lastName(newLastName: string) {
    if (!newLastName)
      throw new Error('user lastName error, the lastName field cannot be blank')

    this.props.lastName = newLastName
    this.props.updatedAt = new Date()
  }

  get email() {
    return this.props.email
  }

  set email(newEmail: string) {
    if (!newEmail)
      throw new Error('user email error, the email field cannot be blank')

    this.props.email = newEmail
    this.props.updatedAt = new Date()
  }

  get password() {
    return this.props.password
  }

  set password(newPassword: string) {
    if (!newPassword)
      throw new Error('user password error, the password field cannot be blank')

    this.props.password = newPassword
    this.props.updatedAt = new Date()
  }

  get createdAt() {
    return this.props.createdAt
  }

  set updatedAt(newValue: Date) {
    if (newValue < this.createdAt) throw new Error('invalid updatedAt')

    this.props.updatedAt = newValue
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  constructor(
    {
      name,
      lastName,
      email,
      password
    }: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    if (!(name && lastName && email && password))
      throw new Error(
        'User blank field error: all non-optional fields must be filled'
      )

    this.props = {
      id: id ?? v4(),
      name,
      lastName,
      email,
      password,
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? new Date()
    }
  }
}
