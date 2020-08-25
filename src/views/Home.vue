<template>
  <main class="home">
    <TheHero />
    <TheFeatures />

    <section class="features section">
      <div class="container">
        <div class="section-inner has-bottom-divider">
          <TutorialsAnim />
        </div>
      </div>
    </section>

    <TheContact />
  </main>
</template>

<script lang="ts">
  import Vue from "vue";
  import TheHero from "@/components/TheHero.vue";
  import TheFeatures from "@/components/TheFeatures.vue";
  import TutorialsAnim from "@/components/TutorialsAnim.vue";
  import TheContact from "@/components/TheContact.vue";

  export default Vue.extend({
    components: {
      TutorialsAnim,
      TheHero,
      TheFeatures,
      TheContact
    }
  });
</script>

<style scoped>
  /* ... */
</style>
