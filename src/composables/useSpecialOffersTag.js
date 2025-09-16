export function useSpecialOffersTag() {
  function applySpecialOffersTag(record) {
    if (!Array.isArray(record.tags)) record.tags = []
    const hasSpecialTag = record.tags.includes('Special Offers')
    if (Number(record.discount) > 0) {
      if (!hasSpecialTag) record.tags.push('Special Offers')
    } else {
      if (hasSpecialTag) record.tags = record.tags.filter(t => t !== 'Special Offers')
    }
  }

  function applyToAll(records) {
    records.forEach(applySpecialOffersTag)
  }

  return { applySpecialOffersTag, applyToAll }
}
