/** All logic related to firebase */
import { Module } from "vuex";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import { FIREBASE_CFG, REALTIME_DB } from "../CST";
import { FirebaseModuleState, AppStoreState } from "./types";

firebase.initializeApp(FIREBASE_CFG);
const db = firebase.database();

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

    // Login with the firebase methods. HAS TO BE WRAPPED IN A TRY CATCH BLOCK
    async loginAdmin(
      { commit },
      { email, pass }: { email: string; pass: string }
    ) {
      // try {
      await firebase.auth().signInWithEmailAndPassword(email, pass);
      // } catch (err) {
      //   console.log(err.code);
      //   console.log(err.message);
      // }

      commit("adminAuth");
    },
  },
  mutations: {
    registerApiKey(state, apiKey) {
      state.apiKey = apiKey;
    },
    adminAuth(state) {
      state.isAdmin = true;
    },
  },
} as Module<FirebaseModuleState, AppStoreState>;
