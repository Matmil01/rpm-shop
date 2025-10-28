// Composable for selecting records to display on the homepage by category,
// prioritizing records marked as "featured" for each category.
// If fewer than 4 featured records exist for a category, fills the rest
// with non-featured records sorted alphabetically by artist.

export function useFeaturedRecords(records) {
  // Returns up to 4 records for a given category.
  // Featured records (with category in their 'featured' array) are shown first.
  // Remaining slots are filled with non-featured records, sorted by artist.
  function recordsByCategory(category) {
    // Find records explicitly marked as featured for this category
    const featured = records.value.filter(
      r => Array.isArray(r.featured) && r.featured.includes(category)
    )
    // Find records in this category that are not featured
    const nonFeatured = records.value.filter(
      r => Array.isArray(r.tags) && r.tags.includes(category) &&
        (!r.featured || !r.featured.includes(category))
    )
    // Sort both lists alphabetically by artist name
    const sortByArtist = arr => [...arr].sort((a, b) =>
      (a.artist || '').localeCompare(b.artist || '')
    )
    // Combine featured first, then non-featured, up to 4 records total
    return [...sortByArtist(featured), ...sortByArtist(nonFeatured)].slice(0, 4)
  }

  // Expose the recordsByCategory function for use in components
  return { recordsByCategory }
}
