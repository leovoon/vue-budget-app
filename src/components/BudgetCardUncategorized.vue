<template>
  <budget-card :amount="amount" description="to be categorized" name="Uncategorized" @add-expense="$emit('addExpense')" @view-expense="$emit('viewExpense')" />
</template>

<script setup lang='ts'>
import { UNCATEGORIZED_BUDGET_ID, useBudget } from '~/stores/budget'

defineEmits(['addExpense', 'viewExpense'])

const budgetStore = useBudget()

const amount = computed(() => budgetStore.getBudgetExpenses(UNCATEGORIZED_BUDGET_ID).reduce(
  (total, expense) => total + expense.amount,
  0,
))
</script>

<style scoped>

</style>
