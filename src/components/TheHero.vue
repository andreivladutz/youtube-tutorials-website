<template>
  <section class="hero">
    <div class="container">
      <div class="hero-inner">
        <div class="hero-copy">
          <h1 class="hero-title mt-0">Landing template for startups</h1>
          <p class="hero-paragraph">
            Our landing page template works on all devices, so you only have to
            set it up once, and get beautiful results forever.
          </p>
          <div class="hero-cta">
            <a class="button button-primary" href="#">Buy it now</a>
          </div>
        </div>
        <div class="hero-media">
          <!-- <ToggableImage
            groupClass="header-illustration"
            imgClass="header-illustration-image"
            imgAlt="Header illustration"
            lightFile="header-illustration-light.svg"
            darkFile="header-illustration-dark.svg"
          /> -->
          <ToggableImage
            groupClass="hero-media-illustration"
            imgClass="hero-media-illustration-image"
            imgAlt="Hero media illustration"
            lightFile="hero-media-illustration-light.svg"
            darkFile="hero-media-illustration-dark.svg"
          />

          <ToggableImage
            groupClass="hero-media-container"
            imgClass="hero-media-image"
            imgAlt="Hero media"
            lightFile="hero-media-light.svg"
            darkFile="hero-media-dark.svg"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import ToggableImage from "@/components/ToggableImage.vue";

export default Vue.extend({
  components: {
    ToggableImage,
  },
});
</script>
