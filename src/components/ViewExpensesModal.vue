<script lang="ts" setup>
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useTimeAgo } from '@vueuse/core'
import { UNCATEGORIZED_BUDGET_ID, useBudget } from '~/stores/budget'
import type { Budgets, Expenses } from '~/stores/budget'
import { currencyFormatter } from '~/composables/currencyFormatter'

const props = defineProps({
  budgetId: {
    type: String,
  },
})
defineEmits([
  ...useDialogPluginComponent.emits,
])
const budgetStore = useBudget()
const $q = useQuasar()

const { getBudgetExpenses, budgets } = storeToRefs(budgetStore)

const budget = computed(() => UNCATEGORIZED_BUDGET_ID === props.budgetId
  ? { name: 'Uncategorized', id: UNCATEGORIZED_BUDGET_ID }
  : budgets.value.find(b => b.id === props.budgetId),
)

const isUncategorized = computed(() => props.budgetId === UNCATEGORIZED_BUDGET_ID)
const { dialogRef, onDialogHide } = useDialogPluginComponent()

function deleteConfirm(budget: Budgets) {
  $q.dialog({
    title: 'Delete budget',
    message: `Are you sure you want to delete ${budget.name}?`,
    ok: 'Delete',
    cancel: 'Cancel',
    persistent: true,
  }).onOk(() => {
    budgetStore.deleteBudget(budget)
    $q.notify({
      position: 'top',
      message: `Deleted budget "${budget.name}".`,
    })
  })
}

let timer: NodeJS.Timeout

function finalize(reset: () => void) {
  timer = setTimeout(() => {
    reset()
  }, 50)
}

onBeforeUnmount(() => {
  clearTimeout(timer)
})

function onRight(expense: Expenses, { reset }: { reset: () => void }) {
  $q.dialog({
    title: 'Delete expense',
    message: `Are you sure you want to delete "${expense.description}"?`,
    ok: 'Delete',
    cancel: 'Cancel',
    persistent: true,
  }).onOk(() => {
    budgetStore.deleteExpense(expense)
    $q.notify({
      position: 'top',
      message: `Deleted expense "${expense.description}".`,
    })
    finalize(reset)
  }).onCancel(() => {
    finalize(reset)
  })
}
</script>

<template>
  <q-dialog ref="dialogRef" medium @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-toolbar-title>
          <div class="q-pa-xs">
            Expenses
          </div>
          <q-chip class="text-caption" square color="teal" text-color="white" icon="bookmark">
            {{ budget?.name }}
          </q-chip>

          <q-btn v-if="!isUncategorized" v-close-popup flat round color="red" dense icon="delete" @click="deleteConfirm(budget)" />
        </q-toolbar-title>

        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-card-section>
        <div class="q-gutter-y-md " style="max-width: 600px">
          <q-list bordered>
            <q-slide-item v-for="expense in getBudgetExpenses(budgetId)" :key="expense.id" right-color="red" @right="onRight(expense, $event) ">
              <q-item v-ripple clickable>
                <q-item-section>
                  <q-skeleton v-if="!expense" type="rect" />
                  <q-item-label class="text-body">
                    {{ expense.description }}
                  </q-item-label>
                  <q-item-label caption class="text-grey-6" v-text="useTimeAgo(expense.timestamp).value" />
                </q-item-section>
                <q-item-section avatar>
                  <q-item-label>
                    <q-skeleton v-if="!expense" type="rect" />
                    {{ currencyFormatter.format(expense.amount) }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <template #right>
                <q-icon name="delete" />
              </template>
            </q-slide-item>
          </q-list>
          <div v-if="getBudgetExpenses(budgetId).length === 0" class="q-pa-lg row items-center justify-center">
            No money spent yet
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
