import Vue from "vue";
import { Module } from "vuex";

import {
  YouTubePlaylistQueryResp,
  PlaylistResp,
  ThumbnailResp,
  YoutubeModuleState,
  AppStoreState,
  Tutorial,
} from "./types";
import CST from "@/CST";

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
        isPlaylists,
      }: { responses: PlaylistResp[]; isPlaylists: boolean }
    ) {
      for (const response of responses) {
        const tutorial: Tutorial = {
          id: response.id,
          publishedAt: response.snippet.publishedAt,
          title: response.snippet.title,
          description: response.snippet.description,
          authorDescription: "",

          // If the tutorials are playlists manage that case
          isPlaylist: isPlaylists,
          playlistVideos: isPlaylists ? {} : undefined,
        };

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
    // async fetchThumbnails({ dispatch, rootState }) {
    //   const missingThumbnails: Tutorial[] = [];

    //   for (const tutorial of rootState.tutorials) {
    //     if (!tutorial.thumbnailUrl) {
    //       missingThumbnails.push(tutorial);
    //     }
    //   }

    //   const playlistIds: string[] = [];
    //   const videoIds: string[] = [];

    //   missingThumbnails.forEach(tutorial => {
    //     if (tutorial.isPlaylist) {
    //       playlistIds.push(tutorial.id);
    //     } else {
    //       videoIds.push(tutorial.id);
    //     }
    //   });

    //   await Promise.all([
    //     dispatch("fetchPlaylistsVideosData", {
    //       ids: videoIds,
    //     }),
    //   ]);
    // },

    // Fetches all the playlists for this channel that were created after the received date
    // Gets a timestamp, fetches and returns the most recent timestamp fetched
    async fetchPlaylists({ dispatch, rootState, commit }) {
      // First, get the api key from the database, then, also get the channel id
      await dispatch("firebase/getYoutubeCredentials", null, { root: true });
      let playlistResp: YouTubePlaylistQueryResp;

      const playlistGenerator: AsyncGenerator<YouTubePlaylistQueryResp> = await dispatch(
        "fetchPlaylistsVideosData",
        {
          ids: [rootState.firebase?.channelId],
          isPlaylists: true,
        }
      );

      // Fetch chunks of playlists' data and save it
      for await (playlistResp of playlistGenerator) {
        commit("saveTutorials", {
          responses: playlistResp.items,
          isPlaylists: true,
        });
      }
    },

    //
    /**
     * Fetch all playlists' or videos' data until all thumbnails urls are fetched
     * @param ids an array of ids
     * @param getPlaylists if the ids belong to playlists or they belong to videos
     */
    async *fetchPlaylistsVideosData(
      { rootState },
      { ids, isPlaylists = false }: { ids: string[]; isPlaylists?: boolean }
    ) {
      let endpoint: (ids: string[], key: string, pageTok: string) => string;

      if (isPlaylists) {
        endpoint = CST.PLAYLIST_ENDPOINT;
      } else {
        endpoint = CST.VIDEO_ENDPOINT;
      }

      // The response of the query to the playlist or video endpoint containing the thumbnail details
      let playlistResponse: YouTubePlaylistQueryResp;
      // While there are next pages keep fetching them
      let nextPageToken = "";

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
