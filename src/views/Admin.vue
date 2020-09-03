<template>
  <main class="admin">
    <FormWrapper :errors="errors" :config="loginConfig" @submitted="loginSubmission" />

    <div v-show="loggingIn" id="login-load-indicator">
      <LoadingIndicator />
    </div>

    <div class="home-container">
      <router-link class="button button-primary go-home" to="/">Go back home</router-link>
    </div>
  </main>
</template>

<script lang="ts">
  import Vue from "vue";
  import { mapActions } from "vuex";

  import FormWrapper from "@/components/FormWrapper.vue";
  import LoadingIndicator from "@/components/tools/LoadingIndicator.vue";
  import {
    FormWrapperParam,
    CustomFormData
    // FirebaseModuleState
  } from "@/store/types";

  export default Vue.extend({
    components: {
      FormWrapper,
      LoadingIndicator
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
        errors: [] as string[],
        // Show a loading indicator while logging in
        loggingIn: false
      };
    },
    methods: {
      ...mapActions("firebase", ["loginAdmin", "checkSignedInStatus"]),
      async loginSubmission(submittedData: CustomFormData) {
        try {
          this.loggingIn = true;

          await this.loginAdmin({
            email: submittedData.email?.value,
            pass: submittedData.password
          });

          this.loggingIn = false;
          // Redirect home automatically
          this.$router.push("/admin/edit");
        } catch (err) {
          const errorMessage =
            "Login failed. Check the email and password again.";
          if (!this.errors.includes(errorMessage)) {
            this.errors.push(errorMessage);
          }
        }
      }
    }
  });
</script>

<style>
  .go-home {
    margin: auto;
  }

  .home-container {
    position: absolute;
    width: 100%;
    height: auto;

    text-align: center;
  }

  .admin {
    position: relative;
  }

  #login-load-indicator {
    position: absolute;

    width: 100%;
    height: auto;

    top: 380px;
    opacity: 0.4;
  }
</style>