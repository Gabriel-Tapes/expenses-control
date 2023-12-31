import { ICategoriesRepository } from '@/repositories/ICategoriesRepository'
import {
  addCategory,
  deleteCategory,
  editCategory,
  getCategory,
  getAllCategories
} from './methods'
import { type Category } from '@/models/category'
import { EditCategoryDTO } from '@/types/DTO'

export class PostgresCategoriesRepository implements ICategoriesRepository {
  addCategory(category: Category): Promise<void> {
    return addCategory(category)
  }
  getCategory(categoryId: string): Promise<Category | null> {
    return getCategory(categoryId)
  }
  getAllCategories(): Promise<Category[]> {
    return getAllCategories()
  }
  editCategory(params: EditCategoryDTO): Promise<Category | null> {
    return editCategory({ ...params })
  }
  deleteCategory(categoryId: string): Promise<number> {
    return deleteCategory(categoryId)
  }
}
