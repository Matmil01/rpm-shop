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
          :src="getProfilePic(comment)"
          alt="Profile Picture"
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
          :src="profilePicSrc"
          alt="Your Profile Picture"
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
import { watch, onMounted } from 'vue'
import { useComments } from '@/composables/user/useComments'
import { useUserStore } from '@/composables/piniaStores/userStore'
import SimpleButton from '@/components/buttons/SimpleButton.vue'
import { useProfilePic } from '@/composables/user/useProfilePic'
import { useCommentUserPic } from '@/composables/user/useCommentUserPic'

const props = defineProps({ recordId: { type: String, required: true } })

const userStore = useUserStore()
const { profilePicSrc } = useProfilePic() // Current user only
const { comments, newComment, addComment } = useComments(props.recordId)

// Use composable for all user profile pics in comments
const {
  getUid,
  getProfilePic,
  hydrateMissingProfilePics,
  DEFAULT_PROFILE_PIC
} = useCommentUserPic()

function imgKey(comment) {
  const uid = getUid(comment) || 'nouid'
  const inline = comment?.profilePic && String(comment.profilePic).trim() || ''
  return `${comment.id}-${uid}-${inline}`
}

function onImgError(e) {
  const img = e?.target
  if (img && img.tagName === 'IMG' && !img.src.endsWith(DEFAULT_PROFILE_PIC)) {
    img.src = DEFAULT_PROFILE_PIC
  }
}

watch(comments, () => {
  hydrateMissingProfilePics(comments.value)
}, { immediate: true })

onMounted(() => {
  hydrateMissingProfilePics(comments.value)
})

async function submitComment() {
  await addComment({ profilePic: profilePicSrc.value })
}
</script>
