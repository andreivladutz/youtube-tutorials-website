<template>
  <main class="home">
    <TheHero />
    <TheFeatures />

    <section-wrapper class="tutorials-section">
      <TutorialsAnim />
    </section-wrapper>

    <TheContact />
  </main>
</template>

<script lang="ts">
import Vue from "vue";
import TheHero from "@/components/TheHero.vue";
import TheFeatures from "@/components/TheFeatures.vue";
import SectionWrapper from "@/components/tools/SectionWrapper.vue";

export default Vue.extend({
  components: {
    TheHero,
    TheFeatures,
    SectionWrapper,
    TutorialsAnim: () => import("@/components/TutorialsAnim.vue"),
    TheContact: () => import("@/components/TheContact.vue"),
  },
});
</script>

<style scoped>
.tutorials-section {
  position: relative;
  z-index: 1;
}
</style>
