import Vue from "vue";
import Vuex from "vuex";

import firebaseModule from "./firebaseModule";
import youtubeModule from "./youtubeModule";

import {
  Tutorial,
  Product,
  AppStoreState,
  PlaylistResp,
  ThumbnailResp,
} from "./types";
import socialMedia from "./socialMedia";

Vue.use(Vuex);

export default new Vuex.Store<AppStoreState>({
  modules: {
    firebase: firebaseModule,
    youtube: youtubeModule,
  },
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
});
