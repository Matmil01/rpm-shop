<script setup>
import { ref } from "vue";
import { useDiscogsSearch } from "@/composables/useDiscogsSearch";
import { useAdminProducts } from "@/composables/useAdminProducts";

const query = ref("");
const { results, loading, searchAlbums } = useDiscogsSearch();
const { addProduct } = useAdminProducts();

const handleSearch = () => {
  if (query.value) searchAlbums(query.value);
};
</script>

<template>
  <div class="p-4">
    <input v-model="query" placeholder="Search albums..." class="border p-2" />
    <button @click="handleSearch" class="ml-2 bg-blue-500 text-white p-2">Search</button>

    <div v-if="loading">Loading...</div>

    <div v-for="album in results" :key="album.id" class="border p-2 mt-2 flex items-center">
      <img :src="album.cover_image" alt="" class="w-16 h-16 object-cover" />
      <div class="ml-4 flex-1">
        <div>{{ album.title }}</div>
        <div class="text-sm text-gray-500">{{ album.year }}</div>
      </div>
      <button @click="addProduct(album)" class="bg-green-500 text-white px-2 py-1">
        Add to Store
      </button>
    </div>
  </div>
</template>
