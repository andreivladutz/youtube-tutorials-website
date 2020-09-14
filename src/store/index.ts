import Vue from "vue";
import Vuex from "vuex";

import firebaseModule from "./firebaseModule";
import youtubeModule from "./youtubeModule";

import {
  Product,
  AppStoreState,
  TutorialsDictionary,
  CategoriesDictionary,
  Category,
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
    categories: {} as CategoriesDictionary,
  },
  mutations: {
    newCategory(state) {
      const category = new Category();
      Vue.set(state.categories, category.uid, category);
    },
    deleteCategory(state, categoryId: string) {
      Vue.delete(state.categories, categoryId);
    },
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
    createCategory({ commit }) {
      commit("newCategory");
    },
    removeCategory({ commit }, categoryId: string) {
      commit("deleteCategory", categoryId);
    },
    // Remove the videos fetched for a playlist => in youtube and
    // TODO: from firebase
    removeVideosInPlaylist({ commit }, playlistId: string) {
      commit("youtube/removeVideoTutorialsFromPlaylist", playlistId);
    },
  },
});
