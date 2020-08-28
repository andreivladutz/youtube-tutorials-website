/** All logic related to firebase */
import { Module } from "vuex";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import { FIREBASE_CFG, REALTIME_DB } from "../CST";
import { FirebaseModuleState, AppStoreState } from "./types";

firebase.initializeApp(FIREBASE_CFG);
const db = firebase.database();

let waitingForAuthStateChange = false;

export default {
  namespaced: true,
  state: {
    // Will be retreived from the realtime db
    apiKey: "",

    // After successful login as admin, will be set to true
    isAdmin: false,
  },
  actions: {
    // Get the api key used to fetch thumbnails
    async getApiKey({ commit }) {
      const apiKey = (await db.ref(REALTIME_DB.KEY_PATH).once("value")).val();

      commit("registerApiKey", apiKey);
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
    registerApiKey(state, apiKey) {
      state.apiKey = apiKey;
    },
    adminAuthStateChange(state, newState: boolean) {
      state.isAdmin = newState;
    },
  },
} as Module<FirebaseModuleState, AppStoreState>;
