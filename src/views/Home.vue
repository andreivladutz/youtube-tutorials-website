<template>
  <div class="home">
    <TutorialsAnim />
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import TutorialsAnim from "@/components/TutorialsAnim.vue";

  export default Vue.extend({
    components: {
      TutorialsAnim
    }
  });
</script>

<style scoped>
  /* ... */
</style>
