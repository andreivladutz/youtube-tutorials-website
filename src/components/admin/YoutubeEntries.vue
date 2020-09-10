<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item v-for="tutorial in dateOrderedTuts" :key="tutorial.id" :name="tutorial.id">
      <template slot="title">
        <div class="clearfix">
          <span>
            {{ tutorial.title }}
            <i v-if="tutorial.isPlaylist">( playlist )</i>
          </span>

          <button
            v-if="tutorial.isPlaylist && activeNames.includes(tutorial.id)"
            class="button push-vids"
            @click.stop="pushPlaylistVids"
          >Add playlist videos</button>
        </div>
      </template>

      <YoutubeEntry :tutorial="tutorial" />
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts">
  import Vue, { PropType } from "vue";
  import { Collapse, CollapseItem } from "element-ui";
  import YoutubeEntry from "./YoutubeEntry.vue";
  import { Tutorial } from "@/store/types";

  export default Vue.extend({
    props: {
      tutorials: {
        type: Object as PropType<{ [Id: string]: Tutorial }>,
        required: true
      },
      defaultOpen: {
        type: Boolean,
        default: false
      }
    },
    components: {
      "el-collapse": Collapse,
      "el-collapse-item": CollapseItem,

      YoutubeEntry
    },
    computed: {
      dateOrderedTuts(): Tutorial[] {
        return Object.values(this.tutorials).sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      }
    },
    data() {
      return {
        activeNames: [] as string[],
        // If default open, open all tutorials as they come
        openedNames: new Set() as Set<string>
      };
    },
    methods: {
      pushPlaylistVids() {
        console.log("PUSHED");
      },
      openTutorial(tutorialId: string) {
        this.activeNames.push(tutorialId);

        return tutorialId;
      }
    },
    watch: {
      tutorials(newValue) {
        if (!this.defaultOpen) {
          return;
        }

        for (const key of Object.keys(newValue)) {
          if (!this.openedNames.has(key)) {
            this.openedNames.add(key);
            this.activeNames.push(key);
          }
        }
      }
    }
  });
</script>

<style>
  div.el-collapse-item span {
    font-size: 0.95rem;
  }

  button.button.push-vids {
    float: right;

    margin: 0.5rem;
  }

  div.el-collapse-item__header {
    height: auto;
  }

  .clearfix {
    width: 100%;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
</style>