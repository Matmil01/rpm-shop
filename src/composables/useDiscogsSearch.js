import { ref } from "vue";

export function useDiscogsSearch() {
  const results = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const searchAlbums = async (query) => {
    loading.value = true;
    try {
      const res = await fetch(
        `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=release&token=${import.meta.env.VITE_DISCOGS_TOKEN}`
      );
      const data = await res.json();
      results.value = data.results;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return { results, loading, error, searchAlbums };
}
