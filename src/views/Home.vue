<template>
  <main class="home">
    <TheHero />
    <TutorialsAnim />
  </main>
</template>

<script lang="ts">
import Vue from "vue";
import TutorialsAnim from "@/components/TutorialsAnim.vue";
import TheHero from "@/components/TheHero.vue";

export default Vue.extend({
  components: {
    TutorialsAnim,
    TheHero,
  },
});
</script>

<style scoped>
/* ... */
</style>
