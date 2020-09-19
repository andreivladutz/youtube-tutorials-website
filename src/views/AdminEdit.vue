<template>
  <main class="home">
    <EditNavbar @sign-out="signOutAndRedirect" />
    <TheHero />

    <section-wrapper>
      <CategoriesTabs />
    </section-wrapper>

    <TheContact />
  </main>
</template>

<script lang="ts">
  import Vue from "vue";
  import EditNavbar from "@/components/admin/EditNavbar.vue";
  import TheHero from "@/components/TheHero.vue";

  import TheContact from "@/components/TheContact.vue";

  import SectionWrapper from "@/components/tools/SectionWrapper.vue";
  import CategoriesTabs from "@/components/admin/CategoriesTabs.vue";

  import { mapActions, mapGetters, mapState } from "vuex";
  import { FirebaseModuleState } from "@/store/types";
  import { RootVueApp } from "@/main";

  export default Vue.extend({
    components: {
      TheHero,
      TheContact,
      EditNavbar,

      SectionWrapper,
      CategoriesTabs
    },
    data() {
      return {
        // This flag tells the beforeRouteLeave hook to sign out the admin user
        shouldSignOut: false
      };
    },
    computed: {
      ...mapState("firebase", {
        isAdmin: state => (state as FirebaseModuleState).isAdmin
      }),
      ...mapGetters({
        hasUnsavedChanges: "firebase/hasUnsavedChanges"
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
    /** Navigation guards that apply page-specific logic */
    beforeRouteEnter(_to, _from, next) {
      next(vm => {
        (vm.$root as RootVueApp).isLightTheme = true;
        // Hide the toggle button
        (vm.$root as RootVueApp).showThemeToggle = false;
      });
    },
    async beforeRouteLeave(_to, _from, next) {
      if (!this.isAdmin) {
        return next();
      }

      let answer = true;
      if (this.hasUnsavedChanges) {
        answer = window.confirm(
          "Are you sure you want to leave? Any unsaved changes will be lost!"
        );
      }

      if (answer) {
        if (this.shouldSignOut) {
          await this.signOut();
          this.shouldSignOut = false;
        }

        // Reset the theme and the toggle button before leaving
        (this.$root as RootVueApp).isLightTheme = false;
        // Show the toggle button
        (this.$root as RootVueApp).showThemeToggle = true;

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
