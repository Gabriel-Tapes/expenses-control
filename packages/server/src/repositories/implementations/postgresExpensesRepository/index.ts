import { type IExpensesRepository } from '@/repositories/IExpensesRepository'
import {
  createExpense,
  deleteExpense,
  editExpense,
  getAllExpenses,
  getCategory,
  getExpense,
  getExpensesByCategory,
  getExpensesByDatePeriod,
  getOwner
} from './methods'
import { type Expense } from '@/models/expense'
import { type User } from '@/models/user'
import { type Category } from '@/models/category'
import { type EditExpenseDTO } from '@/types/DTO'

export class PostgresExpensesRepository implements IExpensesRepository {
  async createExpense(expense: Expense): Promise<void> {
    return await createExpense(expense)
  }
  async getOwner(ownerId: string): Promise<User | null> {
    return getOwner(ownerId)
  }
  async getCategory(categoryId: string): Promise<Category | null> {
    return getCategory(categoryId)
  }
  async getExpense(
    ownerId: string,
    expenseId: string
  ): Promise<Expense | null> {
    return getExpense(ownerId, expenseId)
  }
  async getAllExpenses(ownerId: string): Promise<Expense[]> {
    return getAllExpenses(ownerId)
  }
  async getExpensesByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Expense[]> {
    return getExpensesByDatePeriod(ownerId, startDate, endDate)
  }
  async getExpensesByCategory(
    ownerId: string,
    categoryId: string
  ): Promise<Expense[]> {
    return getExpensesByCategory(ownerId, categoryId)
  }
  async editExpense(params: EditExpenseDTO): Promise<Expense | null> {
    return editExpense({ ...params })
  }
  async deleteExpense(ownerId: string, expenseId: string): Promise<number> {
    return deleteExpense(ownerId, expenseId)
  }
}
