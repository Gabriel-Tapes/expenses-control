import { query } from '@/infra/database'
import { User } from '@/models/user'
import { EditUserDTO } from '@/types/DTO'

export async function editUser({
  id,
  name,
  lastName,
  password
}: EditUserDTO): Promise<User | null> {
  const { rows } = await query(
    `
      UPDATE users
      SET 
        name = COALESCE($2, name),
        lastName = COALESCE($3, lastName),
        password = COALESCE($4, password),
        updatedAt = NOW()
      WHERE id = $1
      RETURNING name, lastName, email, password, createdAt, updatedAt
    `,
    {
      values: [id, name, lastName, password]
    }
  )
  if (rows.length === 0) return null

  const {
    name: editedName,
    lastname: editedLastName,
    email,
    password: editedPassword,
    createdat: createdAt,
    updatedat: updatedAt
  } = rows[0]

  return new User(
    {
      name: editedName,
      lastName: editedLastName,
      email,
      password: editedPassword
    },
    id,
    createdAt,
    updatedAt
  )
}
