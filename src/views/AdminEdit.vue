<template>
  <main class="home">
    <EditNavbar @sign-out="signOutAndRedirect" />
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
  import EditNavbar from "@/components/admin/EditNavbar.vue";
  import TheHero from "@/components/TheHero.vue";
  import TheFeatures from "@/components/TheFeatures.vue";
  import TutorialsAnim from "@/components/TutorialsAnim.vue";
  import TheContact from "@/components/TheContact.vue";
  import { mapActions } from "vuex";

  export default Vue.extend({
    components: {
      TutorialsAnim,
      TheHero,
      TheFeatures,
      TheContact,
      EditNavbar
    },
    methods: {
      ...mapActions("firebase", ["signOut"]),
      async signOutAndRedirect() {
        await this.signOut();

        this.$router.push("/");
      }
    }
  });
</script>

<style scoped>
  /* ... */
</style>
