<template>
  <div class="rounded-3xl bg-MyDark p-6 shadow-MyYellow shadow font-main text-MyYellow">
    <h2 class="text-xl font-headline mb-4 uppercase">Comments</h2>

    <!-- Comments List -->
    <div v-if="comments.length" class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex items-start gap-3 border-b border-MyYellow pb-3"
      >
        <img
          :key="imgKey(comment)"
          :src="getAvatar(comment)"
          alt="Avatar"
          class="w-8 h-8 rounded-full object-cover bg-gray-700 border border-gray-600 shrink-0"
          @error="onImgError"
        />
        <div class="flex-1">
          <div class="font-bold leading-tight">{{ comment.username }}</div>
          <div class="text-sm leading-snug">{{ comment.text }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ comment.date }}</div>
        </div>
      </div>
    </div>
    <div v-else class="text-gray-400 mb-4">No comments yet.</div>

    <!-- Add Comment Form -->
    <div v-if="userStore.loggedIn" class="mt-4">
      <form @submit.prevent="submitComment" class="flex items-start gap-3">
        <img
          :src="userAvatar"
          alt="Your Avatar"
          class="w-8 h-8 rounded-full object-cover bg-gray-700 border border-gray-600 shrink-0"
          @error="onImgError"
        />
        <div class="flex-1 flex flex-col gap-2">
          <textarea
            v-model="newComment"
            rows="2"
            placeholder="Add your (wrong) opinion..."
            class="rounded p-2 bg-MyBlack text-MyYellow border border-MyYellow"
          />
          <div class="self-end">
            <SimpleButton type="submit">Post</SimpleButton>
          </div>
        </div>
      </form>
    </div>
    <div v-else class="mt-4 text-gray-400 text-sm">
      You must be logged in to post a comment.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useComments } from '@/composables/user/useComments'
import { useUserStore } from '@/composables/piniaStores/userStore'
import SimpleButton from '@/components/buttons/SimpleButton.vue'

const props = defineProps({ recordId: { type: String, required: true } })

const userStore = useUserStore()
const DEFAULT_AVATAR = '/avatars/userDefault.svg'

const { comments, newComment, addComment } = useComments(props.recordId)

// Cache avatars for comments that lack profilePic/avatarUrl
const avatarCache = ref({}) // { [uid]: url|null }

const userAvatar = computed(() =>
  (typeof userStore.profilePic === 'string' && userStore.profilePic.trim()) || DEFAULT_AVATAR
)

// Normalize to whatever field the comment used for the author id
function getUid(comment) {
  return (
    comment?.uid ||
    comment?.userId ||
    comment?.userID ||
    comment?.userUid ||
    comment?.authorId ||
    comment?.authorID ||
    null
  )
}

function getAvatar(comment) {
  const inlinePic =
    (comment?.profilePic && String(comment.profilePic).trim()) ||
    (comment?.avatarUrl && String(comment.avatarUrl).trim()) // legacy

  if (inlinePic) return inlinePic

  const uid = getUid(comment)
  const cached = uid ? avatarCache.value[uid] : null
  return (cached && String(cached).trim()) || DEFAULT_AVATAR
}

function imgKey(comment) {
  const uid = getUid(comment) || 'nouid'
  const inline =
    (comment?.profilePic && String(comment.profilePic).trim()) ||
    (comment?.avatarUrl && String(comment.avatarUrl).trim()) ||
    ''
  const cached = avatarCache.value[uid] || ''
  // Re-render when either inline or cached value changes
  return `${comment.id}-${uid}-${inline}-${cached}`
}

function onImgError(e) {
  const img = e?.target
  if (img && img.tagName === 'IMG' && !img.src.endsWith(DEFAULT_AVATAR)) {
    img.src = DEFAULT_AVATAR
  }
}

async function hydrateMissingAvatars() {
  const lookups = []
  const seen = new Set()
  for (const c of comments.value || []) {
    const uid = getUid(c)
    if (!uid) continue

    // Skip if comment already has an inline avatar
    const hasInline =
      (c.profilePic && String(c.profilePic).trim()) ||
      (c.avatarUrl && String(c.avatarUrl).trim())
    if (hasInline) continue

    // Skip if already cached or queued
    if (avatarCache.value[uid] !== undefined) continue
    if (seen.has(uid)) continue
    seen.add(uid)

    lookups.push(
      getDoc(doc(db, 'users', uid))
        .then(snap => {
          const url = snap.exists()
            ? (snap.data().profilePic || snap.data().avatarUrl || null)
            : null
          avatarCache.value = { ...avatarCache.value, [uid]: url }
        })
        .catch(() => {
          avatarCache.value = { ...avatarCache.value, [uid]: null }
        })
    )
  }
  if (lookups.length) await Promise.allSettled(lookups)
}

watch(comments, () => {
  hydrateMissingAvatars()
}, { immediate: true })

onMounted(() => {
  hydrateMissingAvatars()
})

// Ensure we store profilePic with each new comment
async function submitComment() {
  await addComment({ profilePic: userStore.profilePic || null })
}
</script>
