<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useTimestamp } from '@vueuse/core'
import { UNCATEGORIZED_BUDGET_ID, useBudget } from '~/stores/budget'

const props = defineProps({
  budgetId: {
    type: String,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const budgetStore = useBudget()
const $q = useQuasar()

const expense = reactive({
  description: '',
  amount: 0,
})

const expenseForm = ref<HTMLFormElement | null>(null)

const { description, amount } = toRefs(expense)
const timestamp = useTimestamp({ immediate: false })

const { budgets } = storeToRefs(budgetStore)

const budgetOptions = computed(() => {
  const options = budgets.value.map((budget) => {
    return {
      label: budget.name,
      value: budget.id,
    }
  })

  options.push({
    label: 'Uncategorized',
    value: UNCATEGORIZED_BUDGET_ID,
  })

  return options
})

const selectedBudget = ref(budgetOptions.value.find(budget => budget.value === props.budgetId))

function onOKClick() {
  validate(true)
}

async function validate(showErrors: boolean) {
  const isValid = await expenseForm.value?.validate()
  if (isValid) {
    budgetStore.addExpense({
      description: description.value,
      amount: amount.value,
      budgetId: selectedBudget?.value!.value,
      timestamp: timestamp.value,
      id: '',
    })

    $q.notify({
      color: 'green-5',
      textColor: 'white',
      icon: 'cloud_done',
      message: ` Added expense "${description.value}"`,
      position: 'top',
    })
    onDialogOK()
  }
  else if (isValid === false && showErrors) {
    $q.notify({
      message: 'Please fix the errors',
      color: 'negative',
      position: 'top',
      progress: true,
      timeout: 1000,
    })
  }
}

function onCancelClick() {
  return onDialogCancel()
}
</script>

<template>
  <q-dialog ref="dialogRef" medium position="bottom" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-avatar>
          <q-icon class="text-h5" name="add_shopping_cart" />
        </q-avatar>

        <q-toolbar-title>
          New Expense
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <div class="q-gutter-y-md q-pa-md">
        <q-form ref="expenseForm" class="q-gutter-md" @submit.prevent="onOKClick">
          <q-input
            v-model="description"
            name="description"
            class="text-h6"
            clearable
            label="Name"
            stack-label
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            v-model.number="amount"
            class="text-h6"
            name="amount"
            label="Amount"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            input-class="text-right"
            :rules="[(val) => (val && val > 0) || 'How much did you spend?']"
          />

          <q-select
            v-model="selectedBudget"
            :max-values="1"
            name="budgetId"
            input-debounce="0"
            label="Budget"
            :options="budgetOptions"
            behavior="menu"
            :rules="[(val) => (val && val !== null) || 'Please choose budget']"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-form>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            type="submit"
            class="col-3"
            label="Add"
            @click="validate(true)"
          />
          <q-btn color="red" label="Cancel" @click="onCancelClick" />
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>
</template>
