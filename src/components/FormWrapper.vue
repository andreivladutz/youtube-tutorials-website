<template>
  <div class="container-sm">
    <div class="pricing-inner section-inner">
      <div class="contact-header text-center">
        <h2 class="section-title mt-0">{{ config.title }}</h2>
        <p v-if="config.paragraphText" class="section-paragraph mb-0">{{ config.paragraphText }}</p>
      </div>
      <div class="pricing-tables-wrap">
        <div class="pricing-table">
          <div class="pricing-table-inner">
            <div class="pricing-table-main">
              <div class="pricing-table-header pb-24">
                <div class="pricing-table-price">
                  <span class="pricing-table-price-amount h1">{{config.formTitle}}</span>
                </div>
              </div>
              <CustomForm
                :errors="errors"
                :config="config"
                @submitted="$emit('submitted', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue, { PropType } from "vue";
  import CustomForm from "./CustomForm.vue";
  import { FormWrapperParam } from "@/store/types";

  export default Vue.extend({
    props: {
      config: {
        type: Object as PropType<FormWrapperParam>,
        required: true
      },
      // Display errors to the user (Just passed along to the custom form)
      errors: {
        type: Array as PropType<string[]>
      }
    },
    components: {
      CustomForm
    }
  });
</script>
