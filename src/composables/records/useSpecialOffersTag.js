// Composable for managing the "Special Offers" tag based on discount
export function useSpecialOffersTag() {
  // Adds or removes "Special Offers" tag based on discount value
  function applySpecialOffersTag(record) {
    if (!Array.isArray(record.tags)) record.tags = []
    const hasSpecialTag = record.tags.includes('Special Offers')
    // Only add tag if discount > 0 AND stock > 0
    if (Number(record.discount) > 0 && Number(record.stock) > 0) {
      if (!hasSpecialTag) record.tags.push('Special Offers')
    } else {
      if (hasSpecialTag) record.tags = record.tags.filter(t => t !== 'Special Offers')
    }
  }

  // Applies the tag logic to all records in an array
  function applyToAll(records) {
    records.forEach(applySpecialOffersTag)
  }

  return { applySpecialOffersTag, applyToAll }
}
