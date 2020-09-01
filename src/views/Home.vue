<template>
  <main class="home">
    <TheHero />
    <TheFeatures />

    <section class="section">
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

  export default Vue.extend({
    components: {
      TheHero,
      TheFeatures,
      TutorialsAnim: () => import("@/components/TutorialsAnim.vue"),
      TheContact: () => import("@/components/TheContact.vue")
    }
  });
</script>

<style scoped>
  /* ... */
</style>
