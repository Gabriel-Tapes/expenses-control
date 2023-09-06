import { query } from '@/infra/database'
import { Category } from '@/models/category'

export async function getCategory(
  categoryId: string
): Promise<Category | null> {
  const { rows } = await query(
    'SELECT name, createdAt, updatedAt FROM categories WHERE id = $1',
    {
      values: [categoryId]
    }
  )

  if (rows.length === 0) return null

  const { name, createdat: createdAt, updatedat: updatedAt } = rows[0]

  return new Category(
    {
      name
    },
    categoryId,
    createdAt,
    updatedAt
  )
}
