import { Category } from '@/models/category'

export interface ICategoriesRepository {
  addCategory(category: Category): Promise<void>
  getCategory(categoryId: string): Promise<Category | null>
  editCategory(editedCategory: Category): Promise<Category | null>
  deleteCategory(categoryId: string): Promise<void>
}
