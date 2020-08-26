<template>
  <section id="the-contact" class="pricing cta section">
    <div class="container-sm">
      <div class="pricing-inner section-inner">
        <div class="contact-header text-center">
          <h2 class="section-title mt-0">About Me &amp; Contact</h2>
          <p class="section-paragraph mb-0">
            I would love to hear from you so use the contact sheet and get in touch.
            Or you can comment on my videos and get in touch through any of the links in the footer.
          </p>
        </div>
        <div class="pricing-tables-wrap">
          <div class="pricing-table">
            <div class="pricing-table-inner">
              <div class="pricing-table-main">
                <div class="pricing-table-header pb-24">
                  <div class="pricing-table-price">
                    <span class="pricing-table-price-amount h1">Contact Sheet</span>
                  </div>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import ContactForm from "./ContactForm.vue";

  export default Vue.extend({
    components: {
      ContactForm
    }
  });
</script>