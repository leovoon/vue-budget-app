<script setup lang="ts">
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import AddExpenseModalVue from '~/components/AddExpenseModal.vue'
import ViewExpensesModalVue from '~/components/ViewExpensesModal.vue'
import { UNCATEGORIZED_BUDGET_ID, useBudget } from '~/stores/budget'

const budgetStore = useBudget()

const { budgets } = storeToRefs(budgetStore)

function getAmountByBudgetId(budgetId: string) {
  return computed(() => budgetStore.getBudgetExpenses(budgetId).reduce((total, expense) => total + expense.amount, 0)).value
}

const $q = useQuasar()

function openViewExpensesModal(budgetId: string) {
  $q.dialog({
    component: ViewExpensesModalVue,
    componentProps: {
      budgetId,
    },
  })
}

function openAddExpenseModal(budgetId: string) {
  $q.dialog({
    component: AddExpenseModalVue,
    componentProps: {
      budgetId,
    },
  })
}
</script>

<template>
  <div class="q-pa-md row justify-center items-start q-gutter-lg">
    <budget-card v-for="budget in budgets" :key="budget.id" :description="budget.description" :max="budget.max" :name="budget.name" :amount="getAmountByBudgetId(budget.id)" @add-expense="openAddExpenseModal(budget.id)" @view-expense="openViewExpensesModal(budget.id)" />
    <budget-card-uncategorized @add-expense="openAddExpenseModal(UNCATEGORIZED_BUDGET_ID)" @view-expense="openViewExpensesModal(UNCATEGORIZED_BUDGET_ID)" />
  </div>
</template>
