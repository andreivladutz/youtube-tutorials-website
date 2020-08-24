<template>
  <div :class="groupClass">
    <img :class="[imgClass, 'asset-light']" :src="assetsFilepath(lightFile)" :alt="imgAlt" />
    <img :class="[imgClass, 'asset-dark']" :src="assetsFilepath(darkFile)" :alt="imgAlt" />
    <!-- <object
      type="image/svg+xml"
      :data="assetsFilepath(lightFile)"
      :class="[imgClass, 'asset-light']"
    >
      {{ imgAlt }}
    </object>-->
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  export default Vue.extend({
    props: {
      // The container div's class
      groupClass: {
        type: String,
        required: true
      },
      // The images' class
      imgClass: {
        type: String,
        required: true
      },
      // The image alt
      imgAlt: {
        type: String,
        required: true
      },
      lightFile: {
        type: String,
        required: true
      },
      darkFile: {
        type: String,
        required: true
      }
    },
    methods: {
      assetsFilepath: (filename: string) => require(`@/assets/images/${filename}`)
    }
  });
</script>

