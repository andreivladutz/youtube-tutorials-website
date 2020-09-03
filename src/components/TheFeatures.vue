<template>
  <section class="features section">
    <div class="container">
      <div class="features-inner section-inner has-bottom-divider">
        <TheProducts />
        <div class="features-wrap">
          <div class="feature is-revealing">
            <div class="feature-inner">
              <div class="feature-icon">
                <img src="@/assets/images/features/tablets.svg" alt="Feature 01" />
              </div>
              <div class="feature-content">
                <h3 class="feature-title mt-0">Discover</h3>
                <p class="text-sm mb-0">
                  Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua
                  dui.
                </p>
              </div>
            </div>
          </div>
          <div class="feature is-revealing">
            <div class="feature-inner">
              <div class="feature-icon">
                <img src="@/assets/images/features/discord.svg" alt="Feature 02" />
              </div>
              <div class="feature-content">
                <h3 class="feature-title mt-0">Discover</h3>
                <p class="text-sm mb-0">
                  Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua
                  dui.
                </p>
              </div>
            </div>
          </div>
          <div class="feature is-revealing">
            <div class="feature-inner">
              <div class="feature-icon">
                <img src="@/assets/images/features/tornado.svg" alt="Feature 03" />
              </div>
              <div class="feature-content">
                <h3 class="feature-title mt-0">Discover</h3>
                <p class="text-sm mb-0">
                  Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua
                  dui.
                </p>
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
  import TheProducts from "@/components/TheProducts.vue";
  export default Vue.extend({
    components: {
      TheProducts
    }
  });
</script>

<style scoped>
  .feature-icon > img {
    width: 4rem;
    height: 4rem;
  }
</style>
