import { query } from '@/infra/database'

export async function deleteCategory(categoryId: string): Promise<number> {
  const { rows } = await query(
    'DELETE FROM categories WHERE id = $1 RETURNING 1',
    {
      values: [categoryId]
    }
  )

  if (rows.length === 0) return 1

  return 0
}
