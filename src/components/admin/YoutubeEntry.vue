<template>
  <el-card :body-style="{ display: 'flex'}" class="box-card">
    <label :for="tutorial.id">
      <figure
        :style="{
        height: img.height,
        width: 'auto',
        lineHeight: img.height,
      }"
        class="include-wrapper"
      >
        <input :id="tutorial.id" class="tornado-include" type="checkbox" v-model="isVisible" />
      </figure>
    </label>

    <label :for="tutorial.id">
      <lazy-img
        v-thumbnail
        :imgUrl="img.url"
        :imgTitle="tutorial.title"
        :imgAlt="tutorial.title"
        :width="img.width"
        :height="img.height"
      />
    </label>

    <div v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</div>
  </el-card>
</template>

<script lang="ts">
  import Vue, { PropType } from "vue";
  import LazyLoadImg from "../tools/LazyLoadImg.vue";
  import { Card } from "element-ui";
  import { Thumbnail, Tutorial } from "@/store/types";

  import { THUMBNAIL_WIDTH } from "@/CST";

  export default Vue.extend({
    props: {
      tutorial: {
        type: Object as PropType<Tutorial>,
        required: true
      }
    },
    data() {
      const th = this.tutorial.thumbnail as Thumbnail;
      const img = {
        url: th.url as string,
        width: `${THUMBNAIL_WIDTH}px`,
        height: `${(THUMBNAIL_WIDTH * th.height) / th.width}px`
      };

      return {
        img,
        /** Properties to be modified: */
        isVisible: this.tutorial.isVisible
      };
    },
    computed: {},
    components: {
      "lazy-img": LazyLoadImg,
      "el-card": Card
    }
  });
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 100%;
  }

  .button {
    background-color: none;

    position: relative;
    top: -0.25rem;
  }

  .tornado-include {
    width: 1rem;
    height: 1rem;

    margin: 0.5rem;
    vertical-align: middle;
  }

  figure {
    margin: 0;
  }

  label {
    padding-right: 0.5rem;
  }
</style>
