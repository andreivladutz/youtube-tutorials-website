<template>
  <div class="tabs" :style="{userSelect: 'none'}">
    <div style="margin-bottom: 20px;">
      <button class="button button-primary" @click="addTab">Add Category</button>
    </div>
    <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab">
      <el-tab-pane label="All playlists / videos" :closable="false" name="all">
        <YoutubeEntries defaultOpen :tutorials="newlyFetchedTuts" />
      </el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.uid"
        :name="item.uid"
        :label="item.name"
        lazy
        closable
      >
        <!-- <YoutubeEntry /> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
  import Vue, { PropType } from "vue";
  import { Tabs, TabPane } from "element-ui";
  import YoutubeEntries from "./YoutubeEntries.vue";

  import { Tutorial, Category } from "@/store/types";

  export default Vue.extend({
    components: {
      "el-tabs": Tabs,
      "el-tab-pane": TabPane,

      YoutubeEntries
    },
    props: {
      newlyFetchedTuts: {
        type: Object as PropType<{ [Id: string]: Tutorial }>,
        required: true
      }
    },
    data() {
      return {
        editableTabsValue: "all",
        editableTabs: [new Category()] as Category[]
      };
    },
    methods: {
      addTab() {
        const newCategory = new Category();
        this.editableTabs.push(newCategory);

        this.editableTabsValue = newCategory.uid;
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
        this.editableTabs = tabs.filter(tab => tab.uid !== targetName);
      }
    }
  });
</script>

<style lang="scss">
  $font-size: 1rem;

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
</style>
