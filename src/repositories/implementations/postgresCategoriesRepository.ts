import { Category } from '@/models/category'
import { ICategoriesRepository } from '../ICategoriesRepository'
import { query } from '@/infra/database'

export class PostgresCategoriesRepository implements ICategoriesRepository {
  async addCategory(category: Category): Promise<void> {
    console.table({
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    })
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
  async getCategory(categoryId: string): Promise<Category | null> {
    const { rows } = await query(
      'SELECT (name, createdAt, updatedAt) FROM categories WHERE id = $1',
      {
        values: [categoryId]
      }
    )

    if (rows.length === 0) return null

    const { name, createdAt, updatedAt } = rows[0]

    return new Category(
      {
        name
      },
      categoryId,
      createdAt,
      updatedAt
    )
  }
  async editCategory(editedCategory: Category): Promise<Category | null> {
    const { rows } = await query(
      `
        WITH update_category AS (
          UPDATE categories
          SET name = $2, createdAt = $3, updatedAt = $4
          WHERE id = $1
          RETURNING name, createdAt, updatedAt
        )

        SELECT true FROM update_category
        UNION ALL
        SELECT null 
        WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = $1)
      `,
      {
        values: [
          editedCategory.id,
          editedCategory.name,
          editedCategory.createdAt,
          editedCategory.updatedAt
        ]
      }
    )
    if (!rows[0].bool) return null

    return editedCategory
  }
  async deleteCategory(categoryId: string): Promise<void> {
    await query('DELETE FROM categories WHERE id = $1', {
      values: [categoryId]
    })
  }
}
