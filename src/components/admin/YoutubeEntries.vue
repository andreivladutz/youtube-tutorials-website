<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item
      :class="[
        !tutorial['.newly-added'] && newlyAddedAnimation(tutorial)
          ? 'newly-added'
          : '',
        tutorial['.newly-removed'] ? 'newly-removed' : '',
      ]"
      :style="{ marginLeft: tutorial.isPlaylist ? undefined : '5rem' }"
      v-for="tutorial in orderedTutorials"
      :key="tutorial.id"
      :name="tutorial.id"
    >
      <template slot="title">
        <div class="clearfix">
          <span>
            {{ tutorial.title }}
            <i v-if="tutorial.isPlaylist">( playlist )</i>
          </span>

          <button
            v-if="playlistButtonVisible(tutorial)"
            class="button push-vids"
            @click.stop="fetchPlaylistVids(tutorial.id)"
          >
            Fetch playlist videos
          </button>

          <!-- If the videos have been fetched, show the remove button -->
          <button
            v-if="playlistButtonVisible(tutorial) && tutorial.includedVideos"
            class="button push-vids"
            @click.stop="removePlaylistVids(tutorial.id)"
          >
            Remove playlist videos
          </button>
        </div>
      </template>

      <YoutubeEntry :tutorial="tutorial" />
      <YoutubeEntries
        v-if="tutorial.includedVideos"
        :isRoot="false"
        :tutorials="playlistVideosTutorials(tutorial.id)"
        :newlyFetchedTuts="newlyFetchedTuts"
      />
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import YoutubeEntry from "./YoutubeEntry.vue";
import {
  PlaylistTutorial,
  Tutorial,
  TutorialsDictionary,
  VideoTutorial,
} from "@/store/types";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "YoutubeEntries",
  props: {
    // All tutorials (those fetched from youtube and those fetched from firebase)
    tutorials: {
      type: Object as PropType<TutorialsDictionary>,
      required: true,
    },
    // The tutorials just fetched from youtube in this session
    newlyFetchedTuts: {
      type: Object as PropType<TutorialsDictionary>,
      required: true,
    },
    defaultOpen: {
      type: Boolean,
      default: false,
    },
    // The root shows playlists, otherwise it shows videos
    isRoot: {
      type: Boolean,
      default: true,
    },
    loading: Boolean,
  },
  components: {
    YoutubeEntry,
  },
  computed: {
    dateOrderedPlaylists(): Tutorial[] {
      return Object.values(this.tutorials)
        .filter(tutorial => (tutorial as PlaylistTutorial).isPlaylist)
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
    },

    positionOrderedVideos(): Tutorial[] {
      return Object.values(this.tutorials).sort(
        (a, b) => (a as VideoTutorial).position - (b as VideoTutorial).position
      );
    },

    // Order the tutorials depending on what this component is showing (playlist or videos, that is, being a child)
    orderedTutorials(): Tutorial[] {
      if (this.isRoot) {
        return this.dateOrderedPlaylists;
      }

      return this.positionOrderedVideos;
    },
  },
  data() {
    return {
      activeNames: [] as string[],
      // If default open, open all tutorials as they come
      openedNames: new Set() as Set<string>,
    };
  },
  methods: {
    ...mapActions({
      fetchVideosInPlaylist: "youtube/fetchVideosInPlaylist",
      removeVideosInPlaylist: "removeVideosInPlaylist",
    }),

    // Fetch the videos for a playlist tutorial and show them
    async fetchPlaylistVids(playlistId: string) {
      this.$emit("update:loading", true);
      await this.fetchVideosInPlaylist(playlistId);
      this.$emit("update:loading", false);

      const playlistTutorial = this.tutorials[playlistId] as PlaylistTutorial;

      Vue.set(playlistTutorial, "includedVideos", true);
    },

    // Fetch the videos for a playlist tutorial and show them
    async removePlaylistVids(playlistId: string) {
      const playlistTutorial = this.tutorials[playlistId] as PlaylistTutorial;
      Vue.set(playlistTutorial, ".newly-removed", true);

      await new Promise(resolve => setTimeout(() => resolve(), 300));

      Vue.delete(playlistTutorial, ".newly-removed");

      await this.removeVideosInPlaylist(playlistId);
      playlistTutorial.includedVideos = false;
    },

    // Gets the dictionary of tutorials containing only the videos children of the given playlist
    playlistVideosTutorials(playlistId: string): TutorialsDictionary {
      console.log("GETTING DICTIONAR?Y");

      const playlistTutorial = this.tutorials[playlistId] as PlaylistTutorial;
      const videosTutorials = {} as TutorialsDictionary;

      for (const videoId of Object.keys(playlistTutorial.playlistVideos)) {
        videosTutorials[videoId] = this.tutorials[videoId];
      }

      return videosTutorials;
    },

    openTutorial(tutorialId: string) {
      this.activeNames.push(tutorialId);

      return tutorialId;
    },

    // Show a playlist card's buttons if it is opened (not collapsed)
    playlistButtonVisible(tutorial: PlaylistTutorial) {
      return tutorial.isPlaylist && this.activeNames.includes(tutorial.id);
    },

    // Just add a quick border of a different color (for 300ms) to the parent component by adding it a class
    newlyAddedAnimation(tutorial: Tutorial) {
      setTimeout(() => Vue.set(tutorial, ".newly-added", true), 300);

      return true;
    },
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
    },
  },
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
