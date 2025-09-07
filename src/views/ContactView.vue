<template>
  <div class="relative">
    <div class="container mx-auto px-4 relative z-10">
      <div class="flex justify-center pt-10 sm:pt-16">
        <div class="p-6 sm:p-10 rounded-lg shadow-lg w-full max-w-4xl bg-MyBlack">
          <div class="text-center mb-10">
            <h1 class="text-white font-headline text-5xl md:text-6xl mb-2">
              No Refunds
            </h1>
            <h2 class="text-white font-main leading-relaxed text-lg md:text-2xl text-left max-w-4xl mx-auto">
              Men skriv gerne alligevel, så vi kan se om Firebase virker.
            </h2>
          </div>
          <form class="mt-12 w-full space-y-4">
            <input type="text" name="name" placeholder="Bruce Wayne" required
              class="w-full p-3 rounded font-main bg-MyBlack text-white border border-white/30" />

            <input type="email" name="email" placeholder="Batman@batcave.com" required
              class="w-full p-3 rounded font-main bg-MyBlack text-white border border-white/30" />

            <input type="tel" name="phone" placeholder="00 00 00 00" required
              class="w-full p-3 rounded font-main bg-MyBlack text-white border border-white/30" />

            <textarea name="message" rows="4" placeholder="You're awesome" required
              class="w-full p-3 rounded font-main bg-MyBlack text-white border border-white/30"></textarea>

            <button type="submit"
              class="px-6 py-3 rounded-2xl bg-MyRed text-white font-main shadow-lg hover:opacity-90 transition">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
