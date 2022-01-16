<template>
  <q-card class="my-card col-xs-11 col-sm-5 col-md-3 col-lg-5 col-xl-3">
    <q-card-section class="bg-primary text-white" :class="isUncategorized && 'bg-indigo'">
      <div class="text-h6">
        {{ name }}
      </div>
      <div class="text-subtitle2">
        {{ description }}
      </div>
      <q-item-label v-if="isUncategorized" align="right" class="text-h5">
        RM {{ amount ? amount : 0 }}
      </q-item-label>
    </q-card-section>

    <q-separator />

    <div v-if="!isUncategorized" class="row items-center q-gutter-md q-px-md">
      <div class="col">
        <q-linear-progress stripe rounded size="20px" :value="ratio " :color="variant" class="q-mt-sm" />
      </div>
      <q-item-label class="q-pt-xs">
        {{ currencyFormatter.format(amount!) }} / <span class="text-grey">{{ max }}</span>
      </q-item-label>
    </div>

    <q-card-actions align="right">
      <q-btn flat @click="$emit('addExpense')">
        <q-icon name="add" class="q-mr-xs" />
        Add expense
      </q-btn>
      <q-btn flat @click="$emit('viewExpense')">
        <q-icon name="preview" class="q-mr-xs" />
        View expense
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang='ts'>
import { getProgressValue, getProgressVariant } from '~/composables/getProgress'
import { currencyFormatter } from '~/composables/currencyFormatter'
defineEmits(['addExpense', 'viewExpense'])

const props = defineProps({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
  },
  max: {
    type: Number,
  },

})
const isUncategorized = computed(() => props.name === 'Uncategorized')
const ratio = computed(() => getProgressValue(props.amount!, props.max!))
const variant = computed(() => getProgressVariant(props.amount!, props.max!))
</script>

<style scoped>

</style>
