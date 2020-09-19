<template>
  <el-card :body-style="{ display: 'flex' }" class="box-card">
    <label :for="tutorial.id">
      <figure
        :style="{
          height: img.height,
          width: 'auto',
          lineHeight: img.height,
        }"
        class="include-wrapper"
      >
        <!-- For now isVisible will be disabled -->
        <!-- <input
          :id="tutorial.id"
          class="tornado-include"
          type="checkbox"
          v-model="isVisible"
        />-->
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
          @blur="onDescriptionBlur"
          :autosize="{ minRows: 8, maxRows: 12 }"
        ></el-input>
      </label>
      <hr />
      <label>Add the tutorial to one or more categories:</label>
      <el-select
        v-model="tutorialCategories"
        style="width: 100%"
        size="large"
        multiple
        placeholder="Choose category"
      >
        <el-option
          v-for="category in categories"
          :key="category.uid"
          :value="category.uid"
          :label="category.name"
        ></el-option>
      </el-select>
    </div>
  </el-card>
</template>

<script lang="ts">
  import Vue, { PropType } from "vue";
  import LazyLoadImg from "../tools/LazyLoadImg.vue";
  import { Card, Select, Option, Input } from "element-ui";
  import { AppStoreState, Thumbnail, Tutorial } from "@/store/types";

  import { THUMBNAIL_WIDTH } from "@/CST";
  import { mapActions, mapState } from "vuex";

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
        description: this.tutorial.authorDescription || this.tutorial.description
      };
    },
    computed: {
      ...mapState({
        categories: state => Object.values((state as AppStoreState).categories)
      }),

      tutorialCategories: {
        get(): string[] {
          if (!this.tutorial.categories) {
            return [];
          }
          return [...this.tutorial.categories];
        },
        set(categoriesArray: string[]) {
          // Those categories that were in the tutorialCategories but aren't anymore
          const removedCategories = this.tutorialCategories.filter(
            id => !categoriesArray.includes(id)
          );

          // Those categories that weren't and now are
          const addedCategories = categoriesArray.filter(
            id => !this.tutorialCategories.includes(id)
          );

          if (removedCategories.length) {
            this.popCategoryFromTutorial({
              tutorialId: this.tutorial.id,
              categoryId: removedCategories[0]
            });
          }

          if (addedCategories.length) {
            this.pushCategoryToTutorial({
              tutorialId: this.tutorial.id,
              categoryId: addedCategories[0]
            });
          }
        }
      }
    },
    methods: {
      ...mapActions([
        "pushCategoryToTutorial",
        "popCategoryFromTutorial",
        "updateTutorial"
      ]),
      // Update the tutorial via the updateTutorial action which commits mutations
      commitUpdate() {
        this.updateTutorial({
          tutorialId: this.tutorial.id,
          isVisible: this.isVisible,
          authorDescription: this.description
        });
      },

      onDescriptionBlur() {
        this.commitUpdate();
      }
    },
    watch: {
      isVisible() {
        this.commitUpdate();
      },
      "tutorial.isVisible"() {
        this.isVisible = this.tutorial.isVisible;
      },
      "tutorial.authorDescription"() {
        this.description = this.tutorial.authorDescription;
      }
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
