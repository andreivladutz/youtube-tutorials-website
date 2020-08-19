<template>
  <div class="home">
    <button v-on:click.prevent="tutorialsVisible = !tutorialsVisible">Ello</button>

    <TutorialsAnim :isVisible="tutorialsVisible" />
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import TutorialsAnim from "@/components/TutorialsAnim.vue";

  export default Vue.extend({
    components: {
      TutorialsAnim
    },
    data() {
      return {
        tutorialsVisible: false
      };
    }
  });
</script>

<style scoped>
  button {
    display: block;
    margin: auto;
  }
</style>
