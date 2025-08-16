<template>
  <NavBar />

    <router-view />

  <FooterView />
</template>


<script setup>
import NavBar from './components/NavBar.vue';
import FooterView from './components/FooterView.vue';
</script>
