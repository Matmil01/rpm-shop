// Returns up to 4 records for a front page category, prioritizing those with 'featured' field.
// Fills remaining slots with non-featured records, sorted as default.
export function useFeaturedRecords(records) {
  function recordsByCategory(category) {
    const featured = records.value.filter(
      r => Array.isArray(r.featured) && r.featured.includes(category)
    )
    const nonFeatured = records.value.filter(
      r => Array.isArray(r.tags) && r.tags.includes(category) &&
        (!r.featured || !r.featured.includes(category))
    )
    const sortByArtist = arr => [...arr].sort((a, b) =>
      (a.artist || '').localeCompare(b.artist || '')
    )
    return [...sortByArtist(featured), ...sortByArtist(nonFeatured)].slice(0, 4)
  }
  return { recordsByCategory }
}
