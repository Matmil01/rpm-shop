import { ref } from "vue"

// Composable for searching Discogs API for vinyl releases
export function useDiscogsSearch() {
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)

  const searchAlbums = async (query, page = 1) => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(
        `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=release&format=vinyl&page=${page}&token=${import.meta.env.VITE_DISCOGS_TOKEN}`
      )
      const data = await res.json()
      results.value = data.results
    } catch (error) {
      error.value = error.message || "Error occurred while searching Discogs."
    } finally {
      loading.value = false
    }
  }

  // Fetches details for a specific Discogs release by ID
  const fetchReleaseDetails = async (releaseId) => {
    try {
      const res = await fetch(
        `https://api.discogs.com/releases/${releaseId}?token=${import.meta.env.VITE_DISCOGS_TOKEN}`
      )
      if (!res.ok) throw new Error("Failed to fetch release details")
      return await res.json()
    } catch (error) {
      error.value = error.message || "An error occurred while fetching release details."
      return null
    }
  }

  // Clears search results and errors
  const clearResults = () => {
    results.value = []
    error.value = null
  }

  // Expose state and functions
  return { results, loading, error, searchAlbums, fetchReleaseDetails, clearResults }
}
