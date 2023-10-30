import { query } from '@/infra/database'
import { Category } from '@/models/category'
import { EditCategoryDTO } from '@/types/DTO'

export async function editCategory({
  id,
  name
}: EditCategoryDTO): Promise<Category | null> {
  const { rows } = await query(
    `
      UPDATE categories
      SET 
        name = $2, 
        updatedAt = NOW()
      WHERE id = $1
      RETURNING createdAt, updatedAt
    `,
    {
      values: [id, name]
    }
  )
  if (rows.length === 0) return null

  const { createdat: createdAt, updatedat: updatedAt } = rows[0]

  return new Category({ name }, id, createdAt, updatedAt)
}
