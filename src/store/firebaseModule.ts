/** All logic related to firebase */
import Vue from "vue";
import { Module, Commit } from "vuex";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import { CATG_PREFIX, FIREBASE_CFG, TUT_PREFIX } from "../CST";
import {
  FirebaseModuleState,
  AppStoreState,
  Category,
  Tutorial,
  FirebaseModifications,
  PlaylistTutorial,
} from "./types";

firebase.initializeApp(FIREBASE_CFG);
const db = firebase.database();

/**
 * Keep a @param path in sync with the firebase state
 * @param keepUpdated whether to fetch once the value or keep updated at every step
 * @param commit the store commit function
 */
function mapFirebaseToState(
  path: string[],
  keepUpdated: boolean,
  commit: Commit
): Promise<void> {
  const listenMethod: "on" | "once" = keepUpdated ? "on" : "once";
  const firebasePath = path.reduce(
    (reducedPath, key) => `${reducedPath}/${key}`
  );

  return new Promise(resolve => {
    db.ref(firebasePath)[listenMethod]("value", dataSnap => {
      commit("updateStateValue", {
        path: path,
        value: dataSnap.val(),
      });

      resolve();
    });
  });
}

let waitingForAuthStateChange = false;

export default {
  namespaced: true,
  state: {
    // Will be retreived from the realtime db
    apiKey: "",
    channelId: "",

    tutorials: {},
    categories: {},
    // Push the updates to firebase
    changes: {},

    // After successful login as admin, will be set to true
    isAdmin: false,
  },
  actions: {
    // Get the credentials needed to call the yt api like the api key and Gabbitt's channel id
    async getYoutubeCredentials({ commit }) {
      await Promise.all([
        mapFirebaseToState(["apiKey"], false, commit),
        mapFirebaseToState(["channelId"], false, commit),
      ]);
    },

    // Fetch the tutorials and categories from the firebase db
    async fetchFromFirebase({ state, commit, dispatch }) {
      await Promise.all([
        mapFirebaseToState(["tutorials"], false, commit),
        mapFirebaseToState(["categories"], false, commit),
      ]);

      commit("fixFetchedItems");

      for (const categoryLike of Object.values(state.categories)) {
        dispatch("addFetchedCategory", Category.CopyCategory(categoryLike), {
          root: true,
        });
      }
    },

    async signOut() {
      return firebase.auth().signOut();
    },

    // Before logging in, check if the user is already logged in
    async checkSignedInStatus({ state, commit }) {
      return new Promise(resolve => {
        // the listener is already registered
        // Make sure we don't register the listener twice
        if (waitingForAuthStateChange) {
          return resolve(state.isAdmin);
        }

        firebase.auth().onAuthStateChanged(user => {
          // If the user is not null, he has logged in
          commit("adminAuthStateChange", user !== null);
          resolve(state.isAdmin);
        });

        waitingForAuthStateChange = true;
      });
    },

    // Login with the firebase methods. HAS TO BE WRAPPED IN A TRY CATCH BLOCK
    async loginAdmin(
      _options,
      { email, pass }: { email: string; pass: string }
    ) {
      return firebase.auth().signInWithEmailAndPassword(email, pass);
    },

    // Save all the accumulated changes to the firebase db
    async saveChangesToDb({ state, commit }) {
      const updates = {} as FirebaseModifications;

      // Remove all the keys that have illegal characters for saving in firebase
      for (const [path, objRef] of Object.entries(state.changes)) {
        if (objRef === null) {
          updates[path] = null;
          continue;
        }

        const updatedObj = { ...objRef };

        for (const key in updatedObj) {
          if (key.startsWith(".")) {
            // eslint-disable-next-line
            // @ts-ignore
            delete updatedObj[key];
          }
        }

        updates[path] = updatedObj as Tutorial | Category | null;
      }

      await db.ref().update(updates);

      commit("clearModifications");
    },
  },
  getters: {
    // Determine if there are any unsaved ch.
    hasUnsavedChanges(state) {
      return Object.keys(state.changes).length > 0;
    },
  },
  mutations: {
    // Update the state at any path e.g. ["key1", "key2", ...]
    updateStateValue(
      state,
      // eslint-disable-next-line
      { path, value }: { path: (keyof FirebaseModuleState)[]; value: any }
    ) {
      // eslint-disable-next-line
      let ref: any = state;

      for (const key of path.slice(0, -1)) {
        ref = ref[key];
      }

      Vue.set(ref, path[path.length - 1], value);
    },

    // Fix the fetched tutorials and categories e.g. if they had empty array before pushing to firebase
    // Then the fetched items would have no array set
    fixFetchedItems(state) {
      for (const tutorial of Object.values(state.tutorials)) {
        if (!tutorial.categories) {
          Vue.set(tutorial, "categories", []);
        }

        const plyTutorial = tutorial as PlaylistTutorial;
        if (plyTutorial.isPlaylist && !plyTutorial.playlistVideos) {
          Vue.set(tutorial, "playlistVideos", {});
        }
      }

      for (const category of Object.values(state.categories)) {
        if (!category.tutorials) {
          category.tutorials = [];
        }
      }
    },

    // Record any modifications to the tutorials / categories / etc
    recordModifications(
      state,
      {
        modifiedObj,
        deleted,
      }: { modifiedObj: Tutorial | Category; deleted?: boolean }
    ) {
      const id =
        modifiedObj instanceof Category ? modifiedObj.uid : modifiedObj.id;
      const prefix = modifiedObj instanceof Category ? CATG_PREFIX : TUT_PREFIX;

      Vue.set(state.changes, `${prefix}/${id}`, deleted ? null : modifiedObj);
    },
    // Clear all recorded modifications after the changes have been pushed to the db
    clearModifications(state) {
      Vue.set(state, "changes", {});
    },

    adminAuthStateChange(state, newState: boolean) {
      state.isAdmin = newState;
    },
  },
} as Module<FirebaseModuleState, AppStoreState>;
