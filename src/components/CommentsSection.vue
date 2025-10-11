<template>
  <div class="rounded-3xl bg-MyDark p-6 shadow-MyYellow shadow font-main text-MyYellow">
    <h2 class="text-xl font-headline mb-4 uppercase">Comments</h2>
    <!-- Comments List -->
    <div v-if="comments.length">
      <div v-for="comment in comments" :key="comment.id" class="mb-4 border-b border-MyYellow pb-2">
        <div class="font-bold">{{ comment.username }}</div>
        <div class="text-sm">{{ comment.text }}</div>
        <div class="text-xs text-gray-400">{{ comment.date }}</div>
      </div>
    </div>
    <div v-else class="text-gray-400 mb-4">No comments yet.</div>
    <!-- Add Comment Form -->
    <div v-if="userStore.loggedIn">
      <form @submit.prevent="addComment" class="flex flex-col gap-2 mt-4">
        <textarea v-model="newComment" rows="2" placeholder="Add your (wrong) opinion..." class="rounded p-2 bg-MyBlack text-MyYellow border border-MyYellow"></textarea>
        <SimpleButton type="submit" class="self-end">Post</SimpleButton>
      </form>
    </div>
    <div v-else class="mt-4 text-gray-400 text-sm">
      You must be logged in to post a comment.
    </div>
  </div>
</template>

<script setup>
import { useComments } from '@/composables/useComments'
import { useUserStore } from '@/composables/piniaStores/userStore'
import SimpleButton from '@/components/buttons/SimpleButton.vue'

const props = defineProps({
  recordId: { type: String, required: true }
})

const userStore = useUserStore()
const { comments, newComment, addComment } = useComments(props.recordId)
</script>
