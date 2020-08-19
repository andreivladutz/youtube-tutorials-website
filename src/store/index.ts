import Vue from "vue";
import Vuex from "vuex";

import {
  Tutorial,
  YouTubePlaylistQueryResp,
  PlaylistResp,
  ThumbnailResp,
} from "./types";
import CST from "@/CST";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tutorials: [
      {
        id: "PLn3ukorJv4vvh0uQl3qh6QiOnpNlKx6F5",
        isPlaylist: true,

        authorDescription:
          "A very basic series starting right from the beginning",
      },
      {
        id: "PLn3ukorJv4vsPA95G7jTHDHixF5FntFm3",
        isPlaylist: true,

        authorDescription:
          "Another basic description for a basic test. Do some this and do some that, do some kek and come right back",
      },
      {
        id: "PLn3ukorJv4vtf9E9IQk7Acbe7cKkEnuyk",
        isPlaylist: true,
      },
      {
        id: "PLn3ukorJv4vsa02LIuM_IQF-SASAZBnyi",
        isPlaylist: true,
      },
      {
        id: "PLn3ukorJv4vtvjZvdiOeoSA5kBohtnDOF",
        isPlaylist: true,
      },
      {
        id: "PLn3ukorJv4vvv3ZpWJYvV5Tmvo7ISO-NN",
        isPlaylist: true,
      },
      {
        id: "PLn3ukorJv4vu9Tkxju13cHYZCR9kIloe2",
        isPlaylist: true,
      },
      { id: "2j_ViBgx5FA" },
    ] as Tutorial[],
  },
  mutations: {
    // Add the thumbnails' urls to the tutorials that are playlists or videos
    saveThumbnails(state, responses: PlaylistResp[]) {
      for (const response of responses) {
        for (const tutorial of state.tutorials) {
          if (tutorial.id === response.id) {
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

            tutorial.thumbnailUrl = thumbnailObject.url;
            tutorial.title = response.snippet.title;
            tutorial.description = response.snippet.description;
          }
        }
      }
    },
  },
  actions: {
    async fetchThumbnails({ state, dispatch }) {
      const missingThumbnails: Tutorial[] = [];

      for (const tutorial of state.tutorials) {
        if (!tutorial.thumbnailUrl) {
          missingThumbnails.push(tutorial);
        }
      }

      const playlistIds: string[] = [];
      const videoIds: string[] = [];

      missingThumbnails.forEach(tutorial => {
        if (tutorial.isPlaylist) {
          playlistIds.push(tutorial.id);
        } else {
          videoIds.push(tutorial.id);
        }
      });

      await Promise.all([
        dispatch("fetchPlaylistsVideosData", {
          ids: playlistIds,
          isPlaylists: true,
        }),
        dispatch("fetchPlaylistsVideosData", {
          ids: videoIds,
        }),
      ]);
    },

    //
    /**
     * Fetch all playlists' or videos' data until all thumbnails urls are fetched
     * @param ids an array of ids
     * @param getPlaylists if the ids belong to playlists or they belong to videos
     */
    async fetchPlaylistsVideosData(
      { commit },
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

      do {
        playlistResponse = await (
          await fetch(endpoint(ids, CST.API_KEY, nextPageToken))
        ).json();

        nextPageToken = playlistResponse.nextPageToken;
        commit("saveThumbnails", playlistResponse.items);
      } while (playlistResponse.nextPageToken);
    },
  },
  modules: {},
});
