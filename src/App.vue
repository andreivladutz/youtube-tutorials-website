<template>
  <div class="body-wrap boxed-container" id="app">
    <TheHeader />
    <router-view v-show="!$root.loading" />
    <div id="loading-indicator-wrap" v-show="$root.loading">
      <LoadingIndicator />
    </div>
    <TheFooter />
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import TheHeader from "@/components/TheHeader.vue";
  import TheFooter from "@/components/TheFooter.vue";

  import LoadingIndicator from "@/components/tools/LoadingIndicator.vue";

  export default Vue.extend({
    components: {
      TheHeader,
      TheFooter,
      LoadingIndicator
    },
    mounted() {
      // Switch Template-related. To make the images visible
      document.body.classList.add("is-loaded");
    }
  });
</script>

<style>
  #app {
    /* font-family: Avenir, Helvetica, Arial, sans-serif; */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center;
                                      color: #2c3e50; */
  }

  #loading-indicator-wrap {
    height: 70vh;
    padding-top: 25vh;
  }

  /* 
                                    #nav {
                                      padding: 30px;
                                    }

                                    #nav a {
                                      font-weight: bold;
                                      color: #2c3e50;
                                    }

                                    #nav a.router-link-exact-active {
                                      color: #42b983;
                                    } */
</style>
