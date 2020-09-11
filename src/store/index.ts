import Vue from "vue";
import Vuex from "vuex";

import firebaseModule from "./firebaseModule";
import youtubeModule from "./youtubeModule";

import {
  Tutorial,
  Product,
  AppStoreState,
  PlaylistResp,
  ThumbnailResp,
  TutorialsDictionary,
} from "./types";
import socialMedia from "./socialMedia";

Vue.use(Vuex);

export default new Vuex.Store<AppStoreState>({
  modules: {
    firebase: firebaseModule,
    youtube: youtubeModule,
  },
  state: {
    products: [
      {
        title: "Character Course",
        description:
          "If you like what I do and the way I teach then try my character creation course. I go through the full character creation workflow for high end game models from a beginners perspective.",
        linkTo:
          "https://www.gamedev.tv/p/blender-character-creator-2/?coupon_code=GRANTS&affcode=45216_9b6dqwx2",
        // Photo url
        linkPhoto:
          "https://gabbitt.co.uk/____impro/1/onewebmedia/promo.png?etag=%22f2e4f-5edd2c49%22&sourceContentType=image%2Fpng&ignoreAspectRatio&resize=466%2B262",
      },
      {
        title: "The Other Course",
        description:
          "If you like what I do and the way I teach then try my character creation course. I go through the full character creation workflow for high end game models from a beginners perspective.",
        linkTo:
          "https://www.gamedev.tv/p/blender-character-creator-2/?coupon_code=GRANTS&affcode=45216_9b6dqwx2",
        // Photo url
        linkPhoto:
          "https://gabbitt.co.uk/____impro/1/onewebmedia/promo.png?etag=%22f2e4f-5edd2c49%22&sourceContentType=image%2Fpng&ignoreAspectRatio&resize=466%2B262",
      },
    ] as Product[],
    socialMedia,
  },
  getters: {
    tutorials(state): TutorialsDictionary {
      return {
        ...state.youtube?.tutorials,
        ...state.firebase?.tutorials,
      };
    },
  },

  actions: {
    // Remove the videos fetched for a playlist => in youtube and
    // TODO: from firebase
    removeVideosInPlaylist({ commit }, playlistId: string) {
      commit("youtube/removeVideoTutorialsFromPlaylist", playlistId);
    },
  },
});
