<template>
  <div class="features-header text-center">
    <div class="container-sm">
      <h2 class="section-title mt-0">{{ product.title }}</h2>
      <p class="section-paragraph">
        {{ product.description }}
      </p>
      <div class="features-image">
        <div class="parallax-unaffected">
          <ToggableImage
            groupClass
            imgClass="features-illustration"
            imgAlt="Feature illustration"
            lightFile="features/features-illustration-light.svg"
            darkFile="features/features-illustration-dark.svg"
          />
        </div>
        <div class="parallax-scene-products" data-pointer-events="true">
          <div data-depth="0.7" class="parallax-l1">
            <img class="features-box asset-dark" :src="product.linkPhoto" />
            <img class="features-box asset-light" :src="product.linkPhoto" />

            <a :src="product.linkTo" target="_blank"> </a>
          </div>

          <div data-invert-x="false" data-depth="0.2" class="parallax-l2">
            <ToggableImage
              groupClass
              imgClass="features-illustration"
              imgAlt="Feature illustration top"
              lightFile="features/features-illustration-top-light.svg"
              darkFile="features/features-illustration-top-dark.svg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import ToggableImage from "@/components/ToggableImage.vue";
import { Product } from "@/store/types";

// eslint-disable-next-line
// @ts-ignore
import Parallax from "parallax-js";

export default Vue.extend({
  props: {
    product: {
      required: true,
      type: Object as PropType<Product>,
    },
  },
  components: {
    ToggableImage,
  },
  mounted() {
    new Parallax(this.$el.getElementsByClassName("parallax-scene-products")[0]);
  },
});
</script>

<style>
.features-header {
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.features-box {
  width: 548px;
  height: auto;
  max-width: 100%;
}

div.parallax-l1,
div.parallax-l1 img.features-illustration {
  max-width: 100%;
}

.features-image {
  width: 728px;
  height: 458px;
  max-width: 100%;
}

.parallax-l2,
.parallax-l2 img.features-illustration {
  max-width: 100%;
  width: 728px;
  height: 458px;
}
</style>
