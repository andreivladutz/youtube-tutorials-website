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

    <TheThemeToggle />
  </header>
</template>

<script lang="ts">
  import Vue from "vue";
  import TheThemeToggle from "@/components/tools/TheThemeToggle.vue";

  export default Vue.extend({
    components: {
      TheThemeToggle
    }
  });
</script>
