<template>
  <section class="section">
    <div class="container">
      <div class="section-inner has-bottom-divider">
        <CategoriesTabs />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import CategoriesTabs from "@/components/admin/CategoriesTabs.vue";

  export default Vue.extend({
    components: {
      CategoriesTabs
    }
  });
</script>