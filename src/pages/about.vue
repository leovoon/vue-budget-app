<script setup lang="ts">
const info = ref([
  {
    label: 'About this app',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    children: [
      {
        label: 'Author',
        icon: 'face',
        children: [{ label: 'leovoon' }],
      },
      {
        label: 'Technology',
        icon: 'construction',
        children: [{ label: 'Vite' }, { label: 'Vue, Pinia' }, { label: 'Quasar' }],
      },
      {
        label: 'Copyright',
        icon: 'copyright',
        children: [{ label: 'MIT License' }],
      },
      {
        label: 'Github',
        icon: 'code',
        children: [{ label: 'https://github.com/leovoon/vue-budget-app' }],
      },
    ],
  },
])
</script>

<template>
  <div class="q-pa-lg q-gutter-lg ">
    <q-tree default-expand-all :nodes="info" node-key="label" />
  </div>
  <div class="q-pa-md q-gutter-md justify-center row">
    <q-btn class="col-6" color="indigo" icon="bug_report" label="Submit issue" href="https://github.com/leovoon/vue-budget-app/issues/new" />
    <q-btn class="col-6" color="pink-8" icon="star" label="Give a star" href="https://github.com/leovoon/vue-budget-app/" />
  </div>
</template>
