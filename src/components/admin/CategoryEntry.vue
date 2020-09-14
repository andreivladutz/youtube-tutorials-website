<template>
  <div>
    <el-input placeholder="Category's name" v-model="category.name">
      <template slot="prepend">
        <button class="prepended_button">Change category name</button>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts">
  import Vue, { PropType } from "vue";
  import { Input } from "element-ui";

  import { CategoriesDictionary, Category } from "@/store/types";

  export default Vue.extend({
    props: {
      categoryId: {
        type: String,
        required: true
      },
      categories: {
        type: Object as PropType<CategoriesDictionary>,
        required: true
      }
    },
    components: {
      ElInput: Input
    },
    data() {
      return {
        category: Category.CopyCategory(this.categories[this.categoryId])
      };
    }
  });
</script>

<style>
  .prepended_button {
    background-color: transparent;
    border: none;
    width: 100%;

    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    padding: 0 0.5rem;
    font-family: "Gloria Hallelujah", "IBM Plex Sans", sans-serif;

    cursor: pointer;
  }

  .el-input-group__prepend {
    padding: 0;
  }
</style>