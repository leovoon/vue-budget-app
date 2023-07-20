<script lang="ts" setup>
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useBudget } from '~/stores/budget'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const budgetForm = ref<HTMLFormElement | null>(null)

const $q = useQuasar()

const budget = reactive({
  name: '',
  description: '',
  max: 0,
})

const { name, description, max } = toRefs(budget)

const budgetStore = useBudget()

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

function resetForm() {
  name.value = ''
  description.value = ''
  max.value = 0
  budgetForm.value?.resetValidation()
}

function onOKClick() {
  validate(true)
}

async function validate(showErrors: boolean) {
  const isValid = await budgetForm.value?.validate()

  if (isValid) {
    budgetStore.addBudget({
      name: name.value,
      description: description.value,
      max: max.value,
      id: '',
    })
    $q.notify({
      color: 'green-5',
      textColor: 'white',
      icon: 'cloud_done',
      message: `Added ${name.value}.`,
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

// we can passthrough onDialogCancel directly
function onCancelClick() {
  return onDialogCancel()
}
</script>

<template>
  <q-dialog ref="dialogRef" medium position="bottom" @hide="onDialogHide">
    {{ budgetForm?.value }}
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-avatar>
          <q-icon class="text-h5" name="production_quantity_limits" />
        </q-avatar>

        <q-toolbar-title>New Budget</q-toolbar-title>

        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <div class="q-gutter-y-md column q-pa-md">
        <q-form
          ref="budgetForm"
          class="q-gutter-md"
          @submit.prevent="onOKClick"
          @reset="resetForm"
        >
          <q-input
            v-model="name"
            class="text-h6"
            clearable
            label="Name"
            stack-label
            lazy-rules
            name="name"
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            v-model="description"
            name="description"
            class="text-h6"
            clearable
            label="Description"
            stack-label
          />

          <q-input
            v-model.number="max"
            class="text-h6"
            label="Maximum Spending"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            input-class="text-right"
            lazy-rules
            name="max"
            :rules="[(val) => (val && val > 0) || 'How much should I spend?']"
          />
          <q-card-actions align="right">
            <q-btn color="grey" type="reset" label="Reset" />
            <q-btn
              color="primary"
              type="submit"
              class="col-3"
              label="Add"
              @click="validate(true)"
            />
            <q-btn color="red" label="Cancel" @click="onCancelClick" />
          </q-card-actions>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>
