<template>
  <div>
    <!-- The Header Name Change -->
    <form @submit.prevent="rename">
      <el-input required clearable placeholder="Category's name" v-model="category.name">
        <template slot="prepend">
          <button class="prepended_button">Change category name</button>
        </template>
      </el-input>
    </form>

    <draggable
      tag="el-collapse"
      v-model="categoryTuts"
      draggable=".item"
      :component-data="{ 'v-model': activeNames }"
    >
      <el-collapse-item
        v-for="tutorialId in categoryTuts"
        class="item"
        :key="tutorialId"
        :name="tutorialId"
      >
        <template slot="title">
          <span>
            {{ getTutorial(tutorialId).title }}
            <i
              v-if="getTutorial(tutorialId).isPlaylist"
            >( playlist )</i>
          </span>
        </template>

        <YoutubeEntry :tutorial="getTutorial(tutorialId)" />
      </el-collapse-item>
    </draggable>
  </div>
</template>

<script lang="ts">
  import Vue, { PropType } from "vue";
  import draggable from "vuedraggable";
  import { Input } from "element-ui";

  import YoutubeEntry from "@/components/admin/YoutubeEntry.vue";

  import {
    CategoriesDictionary,
    Category,
    Tutorial,
    TutorialsDictionary
  } from "@/store/types";
  import { mapActions, mapGetters } from "vuex";

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
      ElInput: Input,
      draggable,
      YoutubeEntry
    },
    data() {
      return {
        category: Category.CopyCategory(this.categories[this.categoryId]),
        activeNames: [] as string[]
      };
    },
    computed: {
      ...(mapGetters(["tutorials"]) as { tutorials: () => TutorialsDictionary }),

      categoryTuts: {
        get(): string[] {
          return this.categories[this.categoryId].tutorials;
        },
        set(reorderedTuts: string[]) {
          this.reorderCategoryTutorials({
            categoryId: this.categoryId,
            reorderedTuts
          });
        }
      }
    },
    methods: {
      ...mapActions(["renameCategory", "reorderCategoryTutorials"]),
      rename() {
        this.renameCategory({
          categoryId: this.categoryId,
          newName: this.category.name
        });
      },

      getTutorial(tutorialId: string): Tutorial {
        return this.tutorials[tutorialId];
      }
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
