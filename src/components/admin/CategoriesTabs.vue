<template>
  <div class="tabs">
    <div style="margin-bottom: 20px;">
      <button class="button button-primary" @click="addTab">Add Category</button>
    </div>
    <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab">
      <el-tab-pane label="All playlists / videos" :closable="false" name="all">
        <YoutubeEntry v-for="tutorial in newlyFetchedTuts" :key="tutorial.id" :tutorial="tutorial" />
      </el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :name="item.name"
        :label="item.title"
        lazy
        closable
      >
        <!-- <YoutubeEntry /> -->
        {{ item.content }}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
  import Vue, { PropType } from "vue";
  import { Tabs, TabPane } from "element-ui";
  import YoutubeEntry from "./YoutubeEntry.vue";

  import { Tutorial } from "@/store/types";

  export default Vue.extend({
    components: {
      "el-tabs": Tabs,
      "el-tab-pane": TabPane,

      YoutubeEntry
    },
    props: {
      newlyFetchedTuts: {
        type: Object as PropType<{ [Id: string]: Tutorial }>
      }
    },
    data() {
      return {
        editableTabsValue: "all",
        editableTabs: [
          {
            title: "Tab 1",
            name: "1",
            content: "Tab 1 content"
          },
          {
            title: "Tab 2",
            name: "2",
            content: "Tab 2 content"
          }
        ],
        tabIndex: 2
      };
    },
    methods: {
      addTab() {
        const newTabName = `${++this.tabIndex}`;

        this.editableTabs.push({
          title: "New Category",
          name: newTabName,
          content: "New Tab content"
        });

        this.editableTabsValue = newTabName;
      },
      removeTab(targetName: string) {
        const tabs = this.editableTabs;
        let activeName = this.editableTabsValue;

        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];

              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
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
