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
    <div class="edit-wrapper" :style="{ height: img.height }">
      <label>
        <el-input
          type="textarea"
          placeholder="Custom description that's being displayed over the tutorial's thumbnail"
          v-model="description"
          :autosize="{ minRows: 8, maxRows: 12}"
        ></el-input>
      </label>
      <hr />
      <label>
        Add the tutorial to one or more categories:
        <el-select v-model="tutorialCategories" size="large" multiple placeholder="Choose category">
          <el-option
            v-for="category in categories"
            :key="category.uid"
            :value="category.uid"
            :label="category.name"
          ></el-option>
        </el-select>
      </label>
    </div>
  </el-card>
</template>

<script lang="ts">
  import Vue, { PropType } from "vue";
  import LazyLoadImg from "../tools/LazyLoadImg.vue";
  import { Card, Select, Option, Input } from "element-ui";
  import { AppStoreState, Thumbnail, Tutorial } from "@/store/types";

  import { THUMBNAIL_WIDTH } from "@/CST";
  import { mapState } from "vuex";

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
        isVisible: this.tutorial.isVisible,
        description: this.tutorial.authorDescription || this.tutorial.description,
        tutorialCategories: this.tutorial.categories
      };
    },
    computed: {
      ...mapState({
        categories: state => Object.values((state as AppStoreState).categories)
      })
    },
    components: {
      LazyImg: LazyLoadImg,
      ElCard: Card,
      ElSelect: Select,
      ElOption: Option,
      ElInput: Input
    }
  });
</script>

<style scoped>
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

  hr {
    margin: 0.5rem;
  }

  .edit-wrapper {
    padding: 0;
  }
</style>

<style>
  .el-textarea__inner {
    padding: 0;
    min-height: 50%;
    width: 100%;
  }

  .el-textarea {
    width: 100%;
  }
</style>