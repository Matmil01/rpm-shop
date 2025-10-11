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
  function addTag(record, tag) {
    if (!record.tags.includes(tag)) record.tags.push(tag)
  }
  function removeTag(record, tag) {
    record.tags = record.tags.filter(t => t !== tag)
  }
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
