<template>
  <div class="max-w-7xl mx-auto mt-10 p-6 rounded shadow font-main text-MyWhite">
    <table class="w-full table-fixed border-collapse border border-MyDark font-main text-MyWhite bg-MyBlack">
      <thead>
        <tr class="bg-gray-900 text-left text-MyWhite font-main">
          <th
            v-for="col in columns"
            :key="col.key"
            :class="['p-2 border border-MyDark min-w-0', col.thClass]"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="rows.length">
          <tr
            v-for="row in rows"
            :key="row.id"
            class="border-t border-MyDark"
          >
            <slot name="row" :row="row" />
          </tr>
        </template>
        <template v-else>
          <tr>
            <td :colspan="columns.length" class="p-4 text-center text-MyWhite">
              <slot name="empty">No data found.</slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  }
})
</script>
