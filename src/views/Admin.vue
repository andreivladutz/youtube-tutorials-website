<template>
  <main class="admin">
    <FormWrapper :errors="errors" :config="loginConfig" @submitted="loginSubmission" />

    <div class="home-container">
      <router-link class="button button-primary go-home" to="/">Go back home</router-link>
    </div>
  </main>
</template>

<script lang="ts">
  import Vue from "vue";
  import { mapActions, mapState } from "vuex";

  import FormWrapper from "@/components/FormWrapper.vue";
  import {
    FormWrapperParam,
    CustomFormData,
    FirebaseModuleState
  } from "@/store/types";

  export default Vue.extend({
    components: {
      FormWrapper
    },
    data() {
      // Login Form config
      const loginConfig: FormWrapperParam = {
        title: "Edit the Page",
        paragraphText: "",
        formTitle: "Login as Admin",
        buttonText: "Login",
        fields: [
          {
            label: "Email",
            type: "email"
          },
          {
            label: "Password",
            type: "password"
          }
        ]
      };

      return {
        loginConfig,
        // Login Errors
        errors: [] as string[]
      };
    },
    computed: {
      ...mapState("firebase", {
        isAdmin: state => (state as FirebaseModuleState).isAdmin
      })
    },
    watch: {
      isAdmin(newValue: boolean) {
        if (newValue) {
          // Redirect home automatically
          this.$router.push("/admin/edit");
        }
      }
    },
    methods: {
      ...mapActions("firebase", ["loginAdmin", "checkSignedInStatus"]),
      async loginSubmission(submittedData: CustomFormData) {
        try {
          await this.loginAdmin({
            email: submittedData.email?.value,
            pass: submittedData.password
          });
        } catch (err) {
          const errorMessage =
            "Login failed. Check the email and password again.";
          if (!this.errors.includes(errorMessage)) {
            this.errors.push(errorMessage);
          }
        }
      }
    },

    mounted() {
      // Don't let the user login again if he is already logged in (as admin)
      // Will change the isAdmin value
      this.checkSignedInStatus();
    }
  });
</script>

<style scoped>
  .go-home {
    position: absolute;
    margin: auto;
    top: 2rem;
  }

  .home-container {
    text-align: center;
  }
</style>