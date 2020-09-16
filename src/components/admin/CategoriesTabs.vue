<template>
  <div class="tabs" :style="{userSelect: 'none'}">
    <div style="margin-bottom: 20px;">
      <button class="button button-primary" @click="addTab">Add Category</button>
    </div>
    <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab">
      <el-tab-pane label="All playlists / videos" :closable="false" name="all">
        <div style="padding-bottom: 1rem" class="clearfix">
          <button
            class="button button-primary"
            :style="{float: 'right'}"
            @click="fetchNewPlaylists"
          >Fetch new playlists</button>
        </div>

        <div class="loading-indicator-wrapper" v-if="loading">
          <LoadingIndicator />
        </div>

        <YoutubeEntries
          defaultOpen
          :loading.sync="loading"
          :tutorials="tutorials"
          :newlyFetchedTuts="newlyFetchedTuts"
        />
      </el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.uid"
        :name="item.uid"
        :label="item.name"
        lazy
        closable
      >
        <CategoryEntry :categories="categories" :categoryId="item.uid" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Tabs, TabPane } from "element-ui";
  import YoutubeEntries from "./YoutubeEntries.vue";
  import CategoryEntry from "./CategoryEntry.vue";

  import { AppStoreState, Category } from "@/store/types";
  import { mapActions, mapGetters, mapState } from "vuex";

  export default Vue.extend({
    components: {
      "el-tabs": Tabs,
      "el-tab-pane": TabPane,

      YoutubeEntries,
      CategoryEntry
    },
    data() {
      return {
        editableTabsValue: "all",
        loading: false
      };
    },
    computed: {
      ...mapState({
        newlyFetchedTuts: state => (state as AppStoreState).youtube?.tutorials,
        categories: state => (state as AppStoreState).categories
      }),
      ...mapGetters(["tutorials"]),

      editableTabs(): Category[] {
        return Object.values(this.categories);
      }
    },
    methods: {
      ...mapActions({
        fetchPlaylists: "youtube/fetchPlaylists",
        createCategory: "createCategory",
        removeCategory: "removeCategory"
      }),
      async fetchNewPlaylists() {
        this.loading = true;

        const generator: AsyncGenerator<void> = await this.fetchPlaylists();
        await generator.next();

        this.loading = false;

        for await (const _ of generator);
      },
      async addTab() {
        const category = (await this.createCategory()) as Category;

        this.editableTabsValue = category.uid;
      },
      removeTab(targetName: string) {
        const tabs = this.editableTabs;
        let activeName = this.editableTabsValue;

        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.uid === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];

              if (nextTab) {
                activeName = nextTab.uid;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.removeCategory(targetName);
      }
    }
  });
</script>

<style lang="scss">
  $font-size: 1rem;
  $added-color: rgba(0, 255, 242, 0.5);
  $removed-color: rgba(255, 60, 0, 0.5);

  .loading-indicator-wrapper {
    position: fixed;
    top: 40vh;
    left: 0;

    z-index: 9000;

    width: 100%;
    height: 100vh;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
    font-size: $font-size;
    width: $font-size !important;
    height: $font-size;
    line-height: $font-size;
  }

  div.el-tabs__item {
    font-size: $font-size;
    padding: 0 $font-size !important;
    /* line-height: $font-size; */
  }

  .el-collapse-item__header,
  .el-card.is-always-shadow {
    .newly-added & {
      box-shadow: 0 2px 12px 0 $added-color;
      border-color: $added-color;
    }
    .newly-removed & {
      box-shadow: 0 2px 12px 0 $removed-color;
      border-color: $removed-color;
    }
  }
</style>
