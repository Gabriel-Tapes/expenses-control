import { type Expense } from '@/models/expense'
import { type User } from '@/models/user'
import { type Category } from '@/models/category'
import { type EditExpenseDTO } from '@/types/DTO'

export interface IExpensesRepository {
  createExpense(expense: Expense): Promise<void>
  getOwner(ownerId: string): Promise<User | null>
  getCategory(categoryId: string): Promise<Category | null>
  getExpense(ownerId: string, expenseId: string): Promise<Expense | null>
  getAllExpenses(ownerId: string): Promise<Expense[]>
  getExpensesByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Expense[]>
  getExpensesByCategory(ownerId: string, categoryId: string): Promise<Expense[]>
  editExpense({
    id,
    ownerId,
    categoryId,
    description,
    cost,
    paidAt
  }: EditExpenseDTO): Promise<Expense | null>
  deleteExpense(ownerId: string, expenseId: string): Promise<number>
}
