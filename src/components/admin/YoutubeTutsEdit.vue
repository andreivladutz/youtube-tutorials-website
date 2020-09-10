<template>
  <section class="section">
    <div class="container">
      <div class="section-inner has-bottom-divider">
        <CategoriesTabs :newlyFetchedTuts="newlyFetchedTuts" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import CategoriesTabs from "@/components/admin/CategoriesTabs.vue";

  import { mapActions, mapState } from "vuex";
  import { YoutubeModuleState } from "@/store/types";

  export default Vue.extend({
    components: {
      CategoriesTabs
    },
    methods: {
      ...mapActions("youtube", ["fetchPlaylists"])
    },
    computed: {
      ...mapState("youtube", {
        newlyFetchedTuts: state => (state as YoutubeModuleState).tutorials
      })
    },
    created() {
      this.fetchPlaylists();
    }
  });
</script>