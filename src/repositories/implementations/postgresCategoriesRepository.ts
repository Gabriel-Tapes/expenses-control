import { Category } from '@/models/category'
import { ICategoriesRepository } from '../ICategoriesRepository'
import { query } from '@/infra/database'
import { EditCategoryDTO } from '@/types/DTO'

export class PostgresCategoriesRepository implements ICategoriesRepository {
  async addCategory(category: Category): Promise<void> {
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
  async editCategory({ id, name }: EditCategoryDTO): Promise<Category | null> {
    const { rows } = await query(
      `
        UPDATE categories
        SET 
          name = name, 
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

  async deleteCategory(categoryId: string): Promise<number> {
    const { rows } = await query(
      'DELETE FROM categories WHERE id = $1 RETURNING 1',
      {
        values: [categoryId]
      }
    )

    if (rows.length === 0) return 1

    return 0
  }
}
