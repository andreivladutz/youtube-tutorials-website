import Vue from "vue";
import { Module } from "vuex";

import {
  YouTubePlaylistQueryResp,
  PlaylistResp,
  ThumbnailResp,
  YoutubeModuleState,
  AppStoreState,
  Tutorial,
  PlaylistTutorial,
  VideoTutorial,
} from "./types";
import CST from "@/CST";
import { getTutorialReference } from "./utils";

export default {
  namespaced: true,
  state: {
    // Gabbitt's channel
    channelId: "",

    tutorials: {},
  },

  mutations: {
    // Add the thumbnails' urls to the tutorials that are playlists or videos
    saveTutorials(
      state,
      {
        responses,
        playlistParent,
      }: {
        responses: PlaylistResp[];
        playlistParent: PlaylistTutorial;
      }
    ) {
      for (const response of responses) {
        const tutorial: Tutorial = {
          id: response.id,
          publishedAt: response.snippet.publishedAt,
          title: response.snippet.title,
          description: response.snippet.description,
          authorDescription: "",

          // Tutorials are by default hidden
          isVisible: false,
          categories: [],
        };

        // If there isn't any provided playlistParent then interpret the responses as playlists
        const isPlaylists = !playlistParent;

        if (isPlaylists) {
          // If the tutorials are playlists manage that case
          (tutorial as PlaylistTutorial).isPlaylist = isPlaylists;
          (tutorial as PlaylistTutorial).playlistVideos = {};
        } else {
          // Save the global video id and the time of publishing to playlist
          tutorial.id = response.contentDetails?.videoId as string;
          tutorial.publishedAt = response.contentDetails
            ?.videoPublishedAt as string;
          (tutorial as VideoTutorial).position = response.snippet
            .position as number;

          // Save the playlist's id
          // const playlistId = response.snippet.playlistId as string;
          (tutorial as VideoTutorial).playlistId = playlistParent.id;

          // Save this tutorial as part of its playlist
          playlistParent.playlistVideos[tutorial.id] = true;
        }

        let thumbnailObject: ThumbnailResp = {
          url: "",
          width: 0,
          height: 0,
        };
        // The playlist might not have the standard thumbnail or such, so we have to find an existing one
        const thumbnailProps: Array<keyof PlaylistResp["snippet"]["thumbnails"]> = [
          "standard",
          "high",
          "medium",
          "default",
        ];
        for (const prop of thumbnailProps) {
          // Take the one with the largest resolution
          if (response.snippet.thumbnails[prop]) {
            thumbnailObject = response.snippet.thumbnails[prop];
            break;
          }
        }
        tutorial.thumbnail = Object.assign({}, thumbnailObject);

        Vue.set(state.tutorials, tutorial.id, tutorial);
      }
    },
  },
  actions: {
    // Fetches all the playlists for this channel that were created after the received date
    // Gets a timestamp, fetches and returns the most recent timestamp fetched
    async *fetchPlaylists({ state, dispatch, rootState, commit }) {
      if (!rootState.firebase?.channelId) {
        // First, get the api key from the database, then, also get the channel id
        await dispatch("firebase/getYoutubeCredentials", null, { root: true });
      }
      let playlistResp: YouTubePlaylistQueryResp;

      const playlistGenerator: AsyncGenerator<YouTubePlaylistQueryResp> = await dispatch(
        "fetchPlaylistsVideosData",
        {
          ids: [rootState.firebase?.channelId],
          endpoint: CST.PLAYLIST_ENDPOINT,
        }
      );

      // Fetch chunks of playlists' data and save it
      for await (playlistResp of playlistGenerator) {
        commit("saveTutorials", {
          responses: playlistResp.items,
        });

        // After saving each tutorial in this fetched chunk, push it to the changes dictionary so it gets saved in the firebase db
        for (const resp of playlistResp.items) {
          // Save this newly fetched tutorial in the firebase db
          commit(
            "firebase/recordModifications",
            {
              modifiedObj: state.tutorials[resp.id],
            },
            { root: true }
          );
        }

        yield;
      }

      // dispatch("fetchVideosInAllPlaylists");
    },

    // Fetch the videos inside playlists. Should be dispatched only after ALL PLAYLIST have been fetched
    async fetchVideosInAllPlaylists({ state, dispatch }) {
      for (const tutorial of Object.values(state.tutorials)) {
        if (!(tutorial as PlaylistTutorial).isPlaylist) {
          continue;
        }

        dispatch("fetchVideosInPlaylist", tutorial.id);
      }
    },

    /**
     * Fetch the tutorial videos for the playlist with id @param playlistId
     */
    async fetchVideosInPlaylist(
      { state, rootState, dispatch, commit },
      playlistId
    ) {
      let playlistResp: YouTubePlaylistQueryResp;

      const videosGenerator: AsyncGenerator<YouTubePlaylistQueryResp> = await dispatch(
        "fetchPlaylistsVideosData",
        {
          ids: [playlistId],
          endpoint: CST.PLAYLIST_ITEMS_ENDPOINT,
        }
      );

      // The playlist can be in this module (just fetched from youtube) or fetched by firebase
      const playlistParent = getTutorialReference(rootState, playlistId);

      // Fetch chunks of playlists' VIDEOS and save it
      for await (playlistResp of videosGenerator) {
        commit("saveTutorials", {
          responses: playlistResp.items,
          playlistParent,
        });

        // After saving each tutorial in this fetched chunk, push it to the changes dictionary so it gets saved in the firebase db
        for (const resp of playlistResp.items) {
          // Save this newly fetched tutorial in the firebase db
          commit(
            "firebase/recordModifications",
            {
              modifiedObj:
                state.tutorials[resp.contentDetails?.videoId as string],
            },
            { root: true }
          );
        }
      }

      /// Mark this playlist tutorial as modified in the firebase db
      commit(
        "firebase/recordModifications",
        {
          modifiedObj: playlistParent,
        },
        { root: true }
      );
    },

    //
    /**
     * Fetch all playlists' or videos' data until all thumbnails urls are fetched
     * @param ids an array of ids
     * @param getPlaylists if the ids belong to playlists or they belong to videos
     */
    async *fetchPlaylistsVideosData(
      { rootState, dispatch },
      {
        ids,
        endpoint,
      }: {
        ids: string[];
        endpoint: (ids: string[], key: string, pageTok: string) => string;
      }
    ) {
      // The response of the query to the playlist or video endpoint containing the thumbnail details
      let playlistResponse: YouTubePlaylistQueryResp;
      // While there are next pages keep fetching them
      let nextPageToken = "";

      if (!rootState.firebase?.apiKey) {
        // First, get the api key from the database, then, also get the channel id
        await dispatch("firebase/getYoutubeCredentials", null, { root: true });
      }

      const apiKey = rootState.firebase ? rootState.firebase.apiKey : "";

      do {
        playlistResponse = await (
          await fetch(endpoint(ids, apiKey, nextPageToken))
        ).json();

        nextPageToken = playlistResponse.nextPageToken;

        yield playlistResponse;
        // commit("saveThumbnails", playlistResponse.items);
      } while (playlistResponse.nextPageToken);
    },
  },
} as Module<YoutubeModuleState, AppStoreState>;
