<template>
  <section v-lazyload="lazyLoadBg" id="the-contact" class="pricing cta section">
    <FormWrapper :config="config" @submitted="submit" />
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import FormWrapper from "./FormWrapper.vue";
  import { FormWrapperParam, CustomFormData } from "@/store/types";

  export default Vue.extend({
    components: {
      FormWrapper
    },
    data() {
      return {
        config: {
          title: "About Me & Contact",
          paragraphText:
            "I would love to hear from you so use the contact sheet and get in touch. Or you can comment on my videos and get in touch through any of the links in the footer.",
          formTitle: "Contact Sheet",
          buttonText: "Contact me",
          fields: [
            {
              label: "Name",
              type: "text"
            },
            {
              label: "Email",
              type: "email"
            },
            {
              label: "Message",
              type: "message",

              // In case of message i.e. textarea fields
              maxLength: 500
            }
          ]
        } as FormWrapperParam
      };
    },
    methods: {
      submit(data: CustomFormData) {
        console.log(data);
      },
      // When the viewport intersects the section, start loading the bg img
      lazyLoadBg(el: HTMLElement) {
        el.classList.add("contact-lazy");
      }
    }
  });
</script>