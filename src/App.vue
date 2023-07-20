<script lang="ts" setup>
import { Dark, QBtn, useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import AddExpenseModalVue from './components/AddExpenseModal.vue'
import AddBudgetModalVue from '~/components/AddBudgetModal.vue'
import { useBudget } from '~/stores/budget'
import { getProgressValue, getProgressVariant } from '~/composables/getProgress'
import { currencyFormatter } from '~/composables/currencyFormatter'

// total card at bottom
const budgetStore = useBudget()
const $q = useQuasar()
const { expenses, budgets } = storeToRefs(budgetStore)
const amount = computed(() =>
  expenses.value.reduce((total, expense) => total + expense.amount, 0),
)
const max = computed(() => budgets.value.reduce((total, budget) => total + budget.max, 0))
const totalRatio = computed(() => getProgressValue(amount.value, max.value))
const variant = computed(() => getProgressVariant(amount.value, max.value))

function openAddBudgetModal() {
  $q.dialog({
    component: AddBudgetModalVue,
  })
}

function openAddExpenseModal() {
  $q.dialog({
    component: AddExpenseModalVue,
  })
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-avatar>
          <Logo />
        </q-avatar>
        <q-toolbar-title>
          <QBtn flat dense to="/">
            Vue Budget
          </QBtn>
        </q-toolbar-title>
        <QBtn flat round dense class="q-mr-md" icon="info" to="/about" />
        <QBtn flat round dense @click="Dark.toggle()">
          <q-icon v-if="Dark.mode" name="dark_mode" />
          <q-icon v-if="!Dark.mode" name="lightbulb" />
        </QBtn>
      </q-toolbar>

      <q-toolbar align="right" class="q-pa-xs q-mt-xs q-mb-xs bg-primary">
        <div class="col q-gutter-md items-end">
          <QBtn
            color="indigo text-capitalize"
            label="Add Budget"
            icon="calculate"
            @click="openAddBudgetModal"
          />
          <QBtn
            color="secondary text-capitalize"
            label="Add Expense"
            icon-right="attach_money"
            @click="openAddExpenseModal"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-blue-7" reveal elevated>
      <div class="row items-center justify-center">
        <q-toolbar-title class="col q-mx-md">
          Total
        </q-toolbar-title>
        <div class="q-pa-md text-h6">
          {{ currencyFormatter.format(amount) }} /
          {{ max ? currencyFormatter.format(max).replace('RM', '') : 0 }}
        </div>
      </div>

      <div class="q-mx-md q-mb-md">
        <q-linear-progress
          stripe
          rounded
          size="14px"
          :value="totalRatio ? totalRatio : 0"
          :color="variant"
        />
      </div>
    </q-footer>
  </q-layout>
</template>
