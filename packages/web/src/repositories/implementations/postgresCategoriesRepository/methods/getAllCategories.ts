import { query } from '@/infra/database'
import { Category } from '@/models/category'

export async function getAllCategories() {
  const { rows } = await query(
    `
      SELECT json_build_object(
        'id', id,
        'name', name,
        'createdAt', createdat,
        'updatedAt', updatedat
      ) AS category
      FROM categories
    `
  )

  return rows.map(({ category }) => {
    const { id, name, createdAt, updatedAt } = category

    return new Category({ name }, id, new Date(createdAt), new Date(updatedAt))
  })
}
