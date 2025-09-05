<template>
  <footer class="bg-black py-4 border-t-4 border-gray-600 font-main text-MyWhite">
    <div class="container mx-auto flex flex-col md:flex-row items-center justify-between">
      <p>
        © {{ new Date().getFullYear() }} | RPM Shop | Rights and whatnot.
      </p>
      <div class="flex gap-4 mt-3 md:mt-0">
        <a href="https://mondrianandme.com/" target="_blank" rel="noopener" aria-label="Facebook">
          <svg class="w-6 h-6 hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12"/>
          </svg>
        </a>
        <a href="https://floatingqrcode.com/" target="_blank" rel="noopener" aria-label="Instagram">
          <svg class="w-6 h-6 hover:text-pink-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
        </a>
        <a href="https://longdogechallenge.com/" target="_blank" rel="noopener" aria-label="YouTube">
          <svg class="w-6 h-6 hover:text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.8 8.001a2.75 2.75 0 0 0-1.936-1.945C18.003 6 12 6 12 6s-6.003 0-7.864.056A2.75 2.75 0 0 0 2.2 8.001 28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .2 3.999 2.75 2.75 0 0 0 1.936 1.945C5.997 18 12 18 12 18s6.003 0 7.864-.056a2.75 2.75 0 0 0 1.936-1.945A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.2-3.999zM10 15.5v-7l6 3.5-6 3.5z"/>
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>
