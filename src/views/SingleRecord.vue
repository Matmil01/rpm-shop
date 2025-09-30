<template>
  <div class="pt-10"></div>
  <div class="container mx-auto px-4">
    <!-- Main Record Details Container -->
    <div class="rounded-3xl bg-MyDark p-6 shadow-MyYellow shadow font-main text-MyYellow relative">
      <div class="flex flex-col md:flex-row gap-12 md:gap-16">
        <!-- Left: Main Info & Cover -->
        <div
          v-if="record && record.id"
          class="flex-shrink-0 flex flex-col items-center md:items-start gap-4"
        >
          <img
            :src="record.coverImage"
            alt="Album Cover"
            class="w-full max-w-md md:w-96 md:h-96 object-cover rounded shadow"
          />
          <div class="text-lg font-bold text-left mb-1">
            {{ record.album }}
          </div>
          <router-link
            :to="`/shop?search=${encodeURIComponent(record.artist)}`"
            class="text-MyYellow underline hover:opacity-70 transition text-left block mb-2"
          >
            {{ record.artist }}
          </router-link>
          <div class="flex items-center justify-start mt-4 gap-4">
            <AddToCartButton
              v-if="record.stock > 0"
              :item="{
                id: record.id,
                album: record.album,
                artist: record.artist,
                coverImage: record.coverImage,
                price: record.price,
                discount: record.discount
              }"
            />
            <OutOfStock v-else-if="record.id && record.stock === 0" />
            <WishlistButton v-if="record.id" :record="record" />
          </div>
        </div>

        <!-- Right: Details & Tracklist -->
        <div class="flex-1 flex flex-col gap-8">
          <dl class="grid grid-cols-2 gap-x-4 gap-y-4 mb-2">
            <div>
              <dt class="font-semibold">Genre:</dt>
              <dd>
                <template v-if="record.genre">
                  <span v-for="(genre, idx) in record.genre.split(',').map(s => s.trim())" :key="genre">
                    <router-link
                      :to="`/shop?search=${encodeURIComponent(genre)}`"
                      class="underline hover:opacity-70 transition"
                    >
                      {{ genre }}
                    </router-link>
                    <span v-if="idx < record.genre.split(',').length - 1">, </span>
                  </span>
                </template>
                <span v-else>Unknown</span>
              </dd>
            </div>
            <div><dt class="font-semibold">Year:</dt><dd>{{ record.year || 'Unknown' }}</dd></div>
            <div><dt class="font-semibold">Speed:</dt><dd>{{ record.rpm || '33 RPM' }}</dd></div>
            <div><dt class="font-semibold">Format:</dt><dd>{{ record.format || '12"' }}</dd></div>
            <div><dt class="font-semibold">Stock:</dt>
              <dd>
                <span v-if="record.stock > 0 && record.stock < 5" class="text-MyRed font-semibold">
                  Only {{ record.stock }} left, order now!
                </span>
                <span v-else-if="record.stock === 0" class="text-MyRed font-semibold">
                  Out of Stock
                </span>
                <span v-else>
                  {{ record.stock }}
                </span>
              </dd>
            </div>
            <div><dt class="font-semibold">Number of Records:</dt><dd>{{ record.numRecords || '1' }}</dd></div>
          </dl>
          <div v-if="record.tracklist && record.tracklist.length">
            <h2 class="text-lg font-semibold mb-2">Tracklist</h2>
            <ol class="list-decimal list-inside space-y-1">
              <li v-for="(track, idx) in record.tracklist" :key="idx">
                {{ track.position ? track.position + '. ' : '' }}{{ track.title }}
                <span v-if="track.duration" class="text-gray-400 text-sm">({{ track.duration }})</span>
              </li>
            </ol>
          </div>
          <router-link to="/shop" class="text-MyYellow underline hover:opacity-70 transition duration-200 ease-in-out">← Back to Shop</router-link>
        </div>
      </div>
    </div>

    <!-- Commentary Section: visually consistent container -->
    <div class="mt-10">
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
    </div>
  </div>
  <div class="pt-10"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/usePriceCalculator'
import AddToCartButton from '@/components/AddToCartButton.vue'
import OutOfStock from '@/components/OutOfStock.vue'
import WishlistButton from '@/components/WishlistButton.vue'
import SimpleButton from '@/components/SimpleButton.vue'
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import { useUserStore } from '@/composables/piniaStores/userStore'

const route = useRoute()
const record = ref({})
const cart = useCartStore()
const { calculateDiscountedPrice } = usePriceCalculator()
const userStore = useUserStore()
const comments = ref([])
const newComment = ref('')
let unsubscribe = null
let unsubscribeComments = null

const { listenToRecord } = useFirestoreCRUD()

onMounted(() => {
  unsubscribe = listenToRecord(route.params.id, (result) => {
    if (result) record.value = result
  })
  if (route.params.id) {
    listenToComments(route.params.id)
  }
})
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
  if (unsubscribeComments) unsubscribeComments()
})

const discountedPrice = computed(() => {
  if (record.value && record.value.price) {
    return calculateDiscountedPrice(record.value.price, record.value.discount || 0)
  }
  return 0
})

function listenToComments(recordId) {
  const commentsRef = collection(db, 'records', recordId, 'comments')
  const q = query(commentsRef, orderBy('date', 'desc'))
  unsubscribeComments = onSnapshot(q, snapshot => {
    comments.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  })
}

async function addComment() {
  if (!newComment.value.trim() || !record.value.id || !userStore.uid) return
  const commentsRef = collection(db, 'records', record.value.id, 'comments')
  await addDoc(commentsRef, {
    userId: userStore.uid,
    username: userStore.username || 'Anonymous',
    text: newComment.value,
    date: new Date().toLocaleString()
  })
  newComment.value = ''
}
</script>
