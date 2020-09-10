<template>
  <el-card :body-style="{ display: 'flex' }" class="box-card">
    <!-- <div slot="header" class="clearfix">
      <span>
        {{ tutorial.title }}
        <i v-if="tutorial.isPlaylist">( playlist )</i>
      </span>
      <button
        v-if="tutorial.isPlaylist"
        style="float: right"
        class="button"
      >Show videos from playlist</button>
    </div>-->

    <label for="tornado-include">
      <figure
        :style="{
        height: imgHeight,
        width: 'auto',
        lineHeight: imgHeight,
      }"
        class="include-wrapper"
      >
        <input id="tornado-include" type="checkbox" />
      </figure>
    </label>

    <label for="tornado-include">
      <lazy-img
        v-thumbnail
        :imgUrl="imgUrl"
        :imgTitle="tutorial.title"
        :imgAlt="tutorial.title"
        :width="imgWidth"
        :height="imgHeight"
      />
    </label>

    <div v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</div>
  </el-card>
</template>

<script lang="ts">
  import Vue, { PropType } from "vue";
  import LazyLoadImg from "../tools/LazyLoadImg.vue";
  import { Card } from "element-ui";
  import { Tutorial } from "@/store/types";

  import { THUMBNAIL_WIDTH } from "@/CST";

  export default Vue.extend({
    props: {
      tutorial: {
        type: Object as PropType<Tutorial>,
        required: true
      }
    },
    computed: {
      imgUrl(): string {
        return this.tutorial.thumbnail?.url as string;
      },
      imgRatio(): number {
        if (!this.tutorial.thumbnail) {
          return 1;
        }

        return this.tutorial.thumbnail?.height / this.tutorial.thumbnail?.width;
      },
      imgWidth(): string {
        return `${THUMBNAIL_WIDTH}px`;
      },
      imgHeight(): string {
        return `${THUMBNAIL_WIDTH * this.imgRatio}px`;
      }
    },
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

  #tornado-include {
    width: 1rem;
    height: 1rem;

    margin: 0.5rem;
    vertical-align: middle;
  }

  figure {
    margin: 0;
  }

  label[for="tornado-include"] {
    padding-right: 0.5rem;
  }
</style>
