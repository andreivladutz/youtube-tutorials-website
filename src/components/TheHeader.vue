<template>
  <header class="site-header">
    <div class="container">
      <div class="site-header-inner">
        <div class="brand header-brand">
          <h1 class="m-0">
            <a href="#">
              <img class="header-logo-image" src="@/assets/images/logo.png" alt="Logo" />
            </a>
          </h1>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
  import Vue from "vue";
  export default Vue.extend({});
</script>

<style scoped>
  .site-header {
    user-select: none;
    -moz-user-select: none;
  }

  .header-logo-image {
    height: 3.5rem;
  }
</style>