import Vue from "vue";
import Vuex, { Commit } from "vuex";

import firebaseModule from "./firebaseModule";
import youtubeModule from "./youtubeModule";

import {
  Product,
  AppStoreState,
  TutorialsDictionary,
  CategoriesDictionary,
  Category,
  Tutorial,
  PlaylistTutorial,
} from "./types";
import socialMedia from "./socialMedia";

Vue.use(Vuex);

// Get a tutorial's reference having tutorialId whether it is inside the yt module or the firebase module
function getTutorialReference(state: AppStoreState, tutorialId: string) {
  return (state.youtube?.tutorials[tutorialId] ||
    state.firebase?.tutorials[tutorialId]) as Tutorial;
}

// Payloads that contain a tutorialId or categoryId prop usually modify that tutorial / category
function recordModif(
  state: AppStoreState,
  commit: Commit,
  payload: { tutorialId?: string; categoryId?: string }
) {
  if (payload.categoryId) {
    commit("firebase/recordModifications", {
      modifiedObj: state.categories[payload.categoryId],
    });
  }

  if (payload.tutorialId) {
    commit("firebase/recordModifications", {
      modifiedObj: getTutorialReference(state, payload.tutorialId),
    });
  }
}

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
    newCategory(state, category: Category) {
      Vue.set(state.categories, category.uid, category);
    },
    deleteCategory(state, categoryId: string) {
      Vue.delete(state.categories, categoryId);
    },
    renameCategory(
      state,
      { categoryId, newName }: { categoryId: string; newName: string }
    ) {
      const category = state.categories[categoryId];

      category.name = newName;
    },
    reorderCategoryTuts(
      state,
      {
        categoryId,
        reorderedTuts,
      }: { categoryId: string; reorderedTuts: string[] }
    ) {
      const category = state.categories[categoryId];

      Vue.set(category, "tutorials", reorderedTuts);
    },

    // Add a categoryId to a tutorial's categories and the tutorialId to the category's tutorials
    addCategoryToTutorial(
      state,
      { tutorialId, categoryId }: { tutorialId: string; categoryId: string }
    ) {
      const tutorial = getTutorialReference(state, tutorialId);
      const category = state.categories[categoryId];

      tutorial.categories.push(categoryId);
      category.tutorials.push(tutorialId);
    },
    // Remove the category from the tutorial's categories and replace the array
    removeCategoryFromTutorial(
      state,
      { tutorialId, categoryId }: { tutorialId: string; categoryId: string }
    ) {
      const tutorial = getTutorialReference(state, tutorialId);
      const poppedCategories = tutorial.categories.filter(
        id => id !== categoryId
      );

      const category = state.categories[categoryId];
      const poppedTutorials = category.tutorials.filter(
        id => id !== tutorialId
      );

      // Remove the category from the tutorial's categoires
      Vue.set(tutorial, "categories", poppedCategories);
      // Also remove the tutorial from the category
      Vue.set(category, "tutorials", poppedTutorials);
    },
    // Update any primtive type field of a tutorial
    updateTutorial(
      state,
      {
        tutorialId,
        isVisible,
        authorDescription,
      }: { tutorialId: string; isVisible: boolean; authorDescription: string }
    ) {
      const tutorial = getTutorialReference(state, tutorialId);

      Vue.set(tutorial, "isVisible", isVisible);
      Vue.set(tutorial, "authorDescription", authorDescription);
    },

    removeVideoTutorialsFromPlaylist(state, playlistId: string) {
      const playlistTutorial = getTutorialReference(
        state,
        playlistId
      ) as PlaylistTutorial;

      // Remove all video tutorials from the state first and then from the playlist
      for (const videoId of Object.keys(playlistTutorial.playlistVideos)) {
        // Remove the tutorial if it's fetched from firebase
        if (
          state.firebase?.tutorials &&
          state.firebase?.tutorials[playlistId]
        ) {
          Vue.delete(state.firebase?.tutorials, videoId);
        }
        // Also remove the tutorial if it's fetched from youtube
        else if (
          state.youtube?.tutorials &&
          state.youtube?.tutorials[playlistId]
        ) {
          Vue.delete(state.youtube?.tutorials, videoId);
        }

        Vue.delete(playlistTutorial.playlistVideos, videoId);
      }
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
      const category = new Category();
      commit("newCategory", category);

      commit("firebase/recordModifications", {
        modifiedObj: category,
      });

      return category;
    },
    removeCategory({ state, commit, dispatch }, categoryId: string) {
      // Also, remove the category from all tutorials
      const category = state.categories[categoryId];
      for (const tutorialId of category.tutorials) {
        dispatch("popCategoryFromTutorial", { tutorialId, categoryId });
      }

      commit("deleteCategory", categoryId);

      commit("firebase/recordModifications", {
        modifiedObj: category,
        deleted: true,
      });
    },
    renameCategory(
      { state, commit },
      payload: { categoryId: string; newName: string }
    ) {
      commit("renameCategory", payload);

      recordModif(state, commit, payload);
    },
    reorderCategoryTutorials(
      { state, commit },
      payload: { categoryId: string; reorderedTuts: string[] }
    ) {
      commit("reorderCategoryTuts", payload);

      recordModif(state, commit, payload);
    },

    pushCategoryToTutorial(
      { state, commit },
      payload: { categoryId: string; tutorialId: string }
    ) {
      commit("addCategoryToTutorial", payload);

      // Record modifications to both the category and the tutorial
      recordModif(state, commit, payload);
    },
    popCategoryFromTutorial(
      { state, commit },
      payload: { categoryId: string; tutorialId: string }
    ) {
      commit("removeCategoryFromTutorial", payload);

      // Record modifications to both the category and the tutorial
      recordModif(state, commit, payload);
    },
    // Update any primtive type field of a tutorial
    updateTutorial(
      { commit, state },
      payload: {
        tutorialId: string;
        isVisible: boolean;
        authorDescription: string;
      }
    ) {
      commit("updateTutorial", payload);

      // Record modifications to the tutorial
      recordModif(state, commit, payload);
    },

    // Remove the videos fetched for a playlist => in youtube or from firebase
    removeVideosInPlaylist({ state, commit }, playlistId: string) {
      const playlistTutorial = getTutorialReference(
        state,
        playlistId
      ) as PlaylistTutorial;

      // The playlist is losing its videos. Mark as modified
      commit("firebase/recordModifications", {
        modifiedObj: playlistTutorial,
      });

      // Mark each video in the playlist as deleted
      for (const videoId of Object.keys(playlistTutorial.playlistVideos)) {
        commit("firebase/recordModifications", {
          modifiedObj: getTutorialReference(state, videoId),
          deleted: true,
        });
      }

      commit("removeVideoTutorialsFromPlaylist", playlistId);
    },
  },
});
