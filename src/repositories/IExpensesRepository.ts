import { type Expense } from '@/models/expense'
import { type EditExpenseDTO } from '@/types/DTO'

export interface IExpensesRepository {
  createExpense(expense: Expense): Promise<void>
  getExpense(ownerId: string, expenseId: string): Promise<Expense | null>
  getAllExpenses(ownerId: string): Promise<Expense[]>
  getExpensesByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Expense[]>
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
