import { query } from '@/infra/database'
import { Category } from '@/models/category'

export async function getCategory(
  categoryId: string
): Promise<Category | null> {
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
