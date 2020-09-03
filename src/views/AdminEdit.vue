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

  import { mapActions, mapState } from "vuex";
  import { FirebaseModuleState } from "@/store/types";

  export default Vue.extend({
    components: {
      TutorialsAnim,
      TheHero,
      TheFeatures,
      TheContact,
      EditNavbar
    },
    data() {
      return {
        isSaved: false,
        // This flag tells the beforeRouteLeave hook to sign out the admin user
        shouldSignOut: false
      };
    },
    computed: {
      ...mapState("firebase", {
        isAdmin: state => (state as FirebaseModuleState).isAdmin
      })
    },
    methods: {
      ...mapActions("firebase", ["signOut"]),
      async signOutAndRedirect() {
        this.shouldSignOut = true;
        // Redirect home. The signing out will be handled in beforeRouteLeave hook
        this.$router.push("/");
      }
    },
    async beforeRouteLeave(_to, _from, next) {
      if (!this.isAdmin) {
        return next();
      }

      const answer = window.confirm(
        "Are you sure you want to leave? Any unsaved changes might be lost!"
      );

      if (answer) {
        if (this.shouldSignOut) {
          await this.signOut();
          this.shouldSignOut = false;
        }

        next();
      } else {
        // The sign out was cancelled
        this.shouldSignOut = false;

        next(false);
      }
    }
  });
</script>

<style scoped>
  /* ... */
</style>
