import { ref } from 'vue'

const tagsList = [
  'Staff Favorites',
  'Japan Imports',
  'Soundtracks',
  'Doom & Gloom',
  'Shock & Awe',
  'Dad Metal',
  '7-Inch Singles',
]

export function useTags() {
  // Adds a tag to a record if not already present
  function addTag(record, tag) {
    if (!record.tags.includes(tag)) record.tags.push(tag)
  }
  // Removes a tag from a record
  function removeTag(record, tag) {
    record.tags = record.tags.filter(t => t !== tag)
  }
  // Toggles a tag on a record (add if missing, remove if present)
  function toggleTag(record, tag) {
    if (record.tags.includes(tag)) {
      removeTag(record, tag)
    } else {
      addTag(record, tag)
    }
  }
  return {
    tagsList,
    addTag,
    removeTag,
    toggleTag,
  }
}
