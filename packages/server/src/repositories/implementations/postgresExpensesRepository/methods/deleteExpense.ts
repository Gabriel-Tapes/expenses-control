import { query } from '@/infra/database'

export async function deleteExpense(
  ownerId: string,
  expenseId: string
): Promise<number> {
  const { rows } = await query(
    'DELETE FROM expenses WHERE ownerId = $1 and id = $2 RETURNING 1',
    {
      values: [ownerId, expenseId]
    }
  )

  if (rows.length === 0) return 1

  return 0
}
