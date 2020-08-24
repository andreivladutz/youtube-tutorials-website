<template>
  <main class="home">
    <TheHero />
    <TheFeatures />
    <TutorialsAnim />
  </main>
</template>

<script lang="ts">
  import Vue from "vue";
  import TheHero from "@/components/TheHero.vue";
  import TheFeatures from "@/components/TheFeatures.vue";
  import TutorialsAnim from "@/components/TutorialsAnim.vue";

  export default Vue.extend({
    components: {
      TutorialsAnim,
      TheHero,
      TheFeatures
    }
  });
</script>

<style scoped>
  /* ... */
</style>
