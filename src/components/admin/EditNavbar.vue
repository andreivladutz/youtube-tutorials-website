<template>
  <nav class="edit-navbar">
    <h1>You are in edit mode. To go back</h1>
    <button @click="$emit('sign-out')" class="button button-primary button-shadow">Sign Out</button>
  </nav>
</template>

<script lang="ts">
  import Vue from "vue";
  export default Vue.extend({});
</script>

<style scoped lang="scss">
  .edit-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;

    padding: 0;
    line-height: 1.5rem;

    text-align: center;

    width: 100%;
    background-color: rgba(0, 0, 0, 0.35);

    & > h1 {
      display: inline-block;
      top: 0;
      font-size: 1.5rem;
      line-height: 1.5rem;
      padding-right: 1.5rem;
      padding-bottom: 0.5rem;
    }
  }
</style>