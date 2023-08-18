import { Expense } from '@/models/expense'

export interface IExpensesRepository {
  createExpense(ownerId: string, expense: Expense): Promise<void>
  getExpense(ownerId: string, expenseId: string): Promise<Expense | null>
  getAllExpenses(ownerId: string): Promise<Expense[]>
  getExpenseByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Expense[]>
  editExpense(ownerId: string, editedExpense: Expense): Promise<Expense | null>
  deleteExpense(ownerId: string, expense: string): Promise<void>
}
