import { type Category } from '@/models/category'
import { type EditCategoryDTO } from '@/types/DTO'

export interface ICategoriesRepository {
  addCategory(category: Category): Promise<void>
  getCategory(categoryId: string): Promise<Category | null>
  getAllCategories(): Promise<Category[]>
  editCategory({ id, name }: EditCategoryDTO): Promise<Category | null>
  deleteCategory(categoryId: string): Promise<number>
}
