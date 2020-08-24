import Vue from "vue";
import Vuex from "vuex";

import {
  Tutorial,
  YouTubePlaylistQueryResp,
  PlaylistResp,
  ThumbnailResp,
  Product,
} from "./types";
import socialMedia from "./socialMedia";
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
