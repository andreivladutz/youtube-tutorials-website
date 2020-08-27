<template>
  <main class="admin">
    <FormWrapper
      :errors="errors"
      :config="loginConfig"
      @submitted="loginSubmission"
    />

    <section class="hero">
      <div class="container">
        <router-link to="/">Go back home...</router-link>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

import FormWrapper from "@/components/FormWrapper.vue";
import { FormWrapperParam, CustomFormData } from "@/store/types";

export default Vue.extend({
  components: {
    FormWrapper,
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
          type: "email",
        },
        {
          label: "Password",
          type: "password",
        },
      ],
    };

    return {
      loginConfig,
      // Login Errors
      errors: [] as string[],
    };
  },
  methods: {
    ...mapActions("firebase", ["loginAdmin"]),
    async loginSubmission(submittedData: CustomFormData) {
      try {
        await this.loginAdmin({
          email: submittedData.email?.value,
          pass: submittedData.password,
        });
      } catch (err) {
        this.errors.push("Login failed. Check the email and password again.");
      }
    },
  },
});
</script>
