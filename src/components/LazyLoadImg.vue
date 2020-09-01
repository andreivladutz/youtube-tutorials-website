<template>
  <figure v-lazyload="loadImage">
    <img
      class="no-load"
      :style="sizeStyle"
      :data-url="imgUrl"
      :alt="imgAlt"
      :title="(imgTitle || '')"
    />
    <div v-if="!hidePlaceholder" class="img-substitute" :style="sizeStyle"></div>
  </figure>
</template>

<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    props: {
      imgUrl: {
        type: String,
        required: true
      },
      imgAlt: {
        type: String,
        required: true
      },
      imgTitle: {
        type: String
      },
      hidePlaceholder: {
        type: Boolean,
        default: false
      },
      // Optionally pass the sizes (css styles) of the image and placeholder
      width: {
        type: String
      },
      height: {
        type: String
      }
    },
    methods: {
      // Handle lazy loading once the image intersects the viewport
      // The callback of the lazyload directive
      loadImage(el: HTMLElement) {
        const imageElement = el.getElementsByTagName("img")[0];

        // Temporary only lazy-loading images, if there's no image child, exit
        if (!imageElement) {
          return;
        }

        imageElement.onload = () => {
          imageElement.classList.remove("no-load");
        };

        // Kick off the image loading by adding the src attr
        imageElement.src = imageElement.dataset.url as string;
      }
    },
    computed: {
      sizeStyle() {
        return {
          width: this.width,
          height: this.height
        };
      }
    }
  });
</script>

<style scoped>
  .no-load {
    display: none;
  }

  .no-load + .img-substitute {
    border-radius: 5px;
    background-color: #4d4d4d4b;
  }
</style>