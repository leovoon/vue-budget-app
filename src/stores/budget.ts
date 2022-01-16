import { acceptHMRUpdate, defineStore } from 'pinia'
import { v4 as uuidV4 } from 'uuid'
import { useStorage } from '@vueuse/core'
export const UNCATEGORIZED_BUDGET_ID = 'Uncategorized'

export interface Budgets {
  id: string
  name: string
  description: string
  max: number
}

export interface Expenses {
  id: string
  description: string
  amount: number
  budgetId: string
}

export const useBudget = defineStore('budget', {
  state: () => ({
    budgets: useStorage('budgets', [] as Budgets[]),
    expenses: useStorage('expenses', [] as Expenses[]),
  }),
  getters: {
    getBudgetExpenses: (state) => {
      return (budgetId: string | undefined) => state.expenses.filter(expense => expense.budgetId === budgetId)
    },
  },
  actions: {
    addExpense(expenses: Expenses) {
      this.setExpenses(expenses)
    },
    setExpenses({ description, amount, budgetId }: Expenses) {
      this.expenses = [...this.expenses, { id: uuidV4(), description, amount, budgetId }]
      useStorage('expenses', this.expenses)
    },
    addBudget(budget: Budgets) {
      this.setBudgets(budget)
    },
    setBudgets({ name, description, max }: Budgets) {
      if (this.budgets.find(budget => budget.name === name)) { return this.budgets }
      else {
        this.budgets = [...this.budgets, { id: uuidV4(), name, description, max }]
        useStorage('budgets', this.budgets)
      }
    },
    deleteBudget({ id }: Budgets) {
      this.expenses = this.expenses.map((expense: Expenses) => {
        if (expense.budgetId !== id) return expense
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID }
      })
      this.budgets = this.budgets.filter(budget => budget.id !== id)
      useStorage('expenses', this.expenses)
      useStorage('budgets', this.budgets)
    },
    deleteExpense({ id }: Expenses) {
      this.expenses = this.expenses.filter(expense => expense.id !== id)
      useStorage('expenses', this.expenses)
    },
  },
},
)

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useBudget, import.meta.hot))
