<template>
  <agile>
    <ProductShow v-for="product in products" :key="product.title" :product="product" />
    <template slot="prevButton">
      <i>&#8882;</i>
    </template>
    <template slot="nextButton">
      <i>&#8883;</i>
    </template>
  </agile>
</template>

<script lang="ts">
  import Vue from "vue";
  // eslint-disable-next-line
  // @ts-ignore
  import { VueAgile } from "vue-agile";
  import ProductShow from "./ProductShow.vue";
  import { Product } from "@/store/types";

  export default Vue.extend({
    components: {
      agile: VueAgile,
      ProductShow
    },
    computed: {
      products(): Product[] {
        return this.$store.state.products;
      }
    }
  });
</script>

<style lang="sass">
.agile
  width: 100%

  &__actions
    margin-bottom: 2rem

  &__slide
    .parallax-unaffected, .parallax-l2
      display: none

  &__slide.agile__slide--active
    .parallax-unaffected, .parallax-l2
      display: block

  &__list
    max-height: max(100vh, 100vw)

  &__nav-button
    background: transparent
    border: none
    color: #ccc
    cursor: pointer
    font-size: 24px
    transition-duration: .3s

    &:hover
      color: #888

  &__dot
    margin: 0 10px

    button
      background-color: #eee
      border: none
      border-radius: 50%
      cursor: pointer
      display: block
      height: 10px
      font-size: 0
      line-height: 0
      margin: 0
      padding: 0
      transition-duration: .3s
      width: 10px

    &--current,
    &:hover
      button
        background-color: #888
</style>
