/** All logic related to firebase */
import { Module, Commit } from "vuex";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import { FIREBASE_CFG, REALTIME_DB } from "../CST";
import { FirebaseModuleState, AppStoreState } from "./types";

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
  },
  mutations: {
    // Update the state at any path e.g. ["key1", "key2", ...]
    updateStateValue(
      state,
      { path, value }: { path: (keyof FirebaseModuleState)[]; value: any }
    ) {
      let ref: any = state;

      for (const key of path.slice(0, -1)) {
        ref = ref[key];
      }

      ref[path[path.length - 1]] = value;
    },

    adminAuthStateChange(state, newState: boolean) {
      state.isAdmin = newState;
    },
  },
} as Module<FirebaseModuleState, AppStoreState>;
