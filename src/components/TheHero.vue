<template>
  <section class="hero">
    <div class="container">
      <div class="hero-inner">
        <div class="hero-copy">
          <h1 class="hero-title mt-0">Welcome to Gabbitt Media!</h1>
          <p class="hero-paragraph">
            I am a 3d artist, film maker and teacher.
            I specialise in Blender and produce 3d graphics and animations as well as instructional videos. I am based in Ipswich, UK.
          </p>
          <div class="hero-cta">
            <a href="#the-contact">Contact Me</a>
          </div>
        </div>
        <div id="parallax-scene" class="hero-media">
          <!-- <ToggableImage
            groupClass="header-illustration"
            imgClass="header-illustration-image"
            imgAlt="Header illustration"
            lightFile="header-illustration-light.svg"
            darkFile="header-illustration-dark.svg"
          />-->

          <div>
            <div class="hero-media-container">
              <div class="hero-media-image"></div>
            </div>
            <!-- <ToggableImage
              groupClass="hero-media-container"
              imgClass="hero-media-image"
              imgAlt="Hero media"
              lightFile="hero-media-light.svg"
              darkFile="hero-media-dark.svg"
            />-->
          </div>
          <div class="parallax-hero-layer" data-depth="0.2">
            <ToggableImage
              groupClass="hero-media-illustration"
              imgClass="hero-media-illustration-image"
              imgAlt="Hero media illustration"
              lightFile="hero/hero-media-illustration-light.svg"
              darkFile="hero/hero-media-illustration-dark.svg"
            />
          </div>
          <div class="parallax-hero-layer" data-depth="0.5">
            <ToggableImage
              groupClass="hero-media-illustration"
              imgClass="hero-media-illustration-image"
              imgAlt="Hero media illustration"
              lightFile="hero/hero-dark-mid.svg"
              darkFile="hero/hero-dark-mid.svg"
            />
          </div>
          <div class="parallax-hero-layer" data-depth="0.8">
            <ToggableImage
              groupClass="hero-media-illustration"
              imgClass="hero-media-illustration-image"
              imgAlt="Hero media illustration top"
              lightFile="hero/hero-light-top.svg"
              darkFile="hero/hero-dark-top.svg"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import ToggableImage from "@/components/ToggableImage.vue";

  // eslint-disable-next-line
  // @ts-ignore
  import Parallax from "parallax-js/src/parallax";

  export default Vue.extend({
    components: {
      ToggableImage
    },
    mounted() {
      new Parallax(document.getElementById("parallax-scene"), null);
    }
  });
</script>

<style>
  div.hero-media-container > div.hero-media-image {
    visibility: hidden;
    width: 538px;
    height: 380px;
  }
  .parallax-hero-layer {
    max-width: 136%;
    width: 733px;
    height: 749px;
  }

  div.hero-cta > a[href="#the-contact"] {
    color: #535fd7;
  }
</style>
