import { query } from '@/infra/database'
import { Category } from '@/models/category'

export async function addCategory(category: Category): Promise<void> {
  await query(
    'INSERT INTO categories (id, name, createdAt, updatedAt) VALUES ($1, $2, $3, $4)',
    {
      values: [
        category.id,
        category.name,
        category.createdAt.toISOString(),
        category.updatedAt.toISOString()
      ]
    }
  )
}
