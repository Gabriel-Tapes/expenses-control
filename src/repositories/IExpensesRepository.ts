import { type Expense } from '@/models/expense'
import { User } from '@/models/user'
import { type EditExpenseDTO } from '@/types/DTO'

export interface IExpensesRepository {
  createExpense(expense: Expense): Promise<void>
  getOwner(ownerId: string): Promise<User | null>
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
