<template>
  <NavBar />

    <router-view />

  <FooterView />
</template>


<script setup>
import './main.css'
import NavBar from './components/NavBar.vue';
import FooterView from './components/FooterView.vue';
</script>
