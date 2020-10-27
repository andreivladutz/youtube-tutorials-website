// Fetch 20 media items at once instead of the default 5 per request
const RESULTS_PER_PAGE = 20;

function ENDPOINT_URL(
  mediaId: "videos" | "playlists" | "playlistItems",
  ids: string[],
  apiKey: string,
  pageToken?: string
) {
  const idString = ids.length
    ? ids.reduce((idStr, currId) => `${idStr},${currId}`)
    : "";
  // If we are fetching videos, we want to fetch them by their ids.
  // If we are fetching playlistItems (videos inside playlists) we want to fetch them by playlistId
  // Otherwise, if we are fetching playlists we want to fetch them all for Gabbit's channel
  let idEndpoint: string;
  let partEndpoint = "snippet";

  switch (mediaId) {
    case "videos":
      idEndpoint = "id";
      break;
    case "playlists":
      idEndpoint = "channelId";
      break;
    case "playlistItems":
      idEndpoint = "playlistId";
      partEndpoint += ",contentDetails";
      break;
  }

  idEndpoint = `${idEndpoint}=${idString}`;

  return `https://www.googleapis.com/youtube/v3/${mediaId}?part=${partEndpoint}&${idEndpoint}&maxResults=${RESULTS_PER_PAGE}&key=${apiKey}${
    pageToken ? `&pageToken=${pageToken}` : ""
  }`;
}

export default {
  VIDEO_ENDPOINT(videosIds: string[], apiKey: string, pageToken?: string) {
    return ENDPOINT_URL("videos", videosIds, apiKey, pageToken);
  },

  PLAYLIST_ITEMS_ENDPOINT(
    playlistIds: string[],
    apiKey: string,
    pageToken?: string
  ) {
    return ENDPOINT_URL("playlistItems", playlistIds, apiKey, pageToken);
  },
  /**
   * Return the endpoint string to fetch a youtube playlist's thumbnail url
   * @param playlistIds
   * @param apiKey
   * @param pageToken the token to fetch the next page in case of multiple pages
   */
  PLAYLIST_ENDPOINT(playlistIds: string[], apiKey: string, pageToken?: string) {
    return ENDPOINT_URL("playlists", playlistIds, apiKey, pageToken);
  },
};

export const FIREBASE_CFG = {
  apiKey: "AIzaSyA7RxrhmPCoqfQNtQNx3dir9Abw9U97Fw4",
  authDomain: "gabbit-media.firebaseapp.com",
  databaseURL: "https://gabbit-media.firebaseio.com",
  projectId: "gabbit-media",
  storageBucket: "gabbit-media.appspot.com",
  messagingSenderId: "686138924877",
  appId: "1:686138924877:web:ffcb83c3c186311788e104",
};

export const THUMBNAIL_WIDTH = 480;
// The thumbnail height after the polygon clip-path cut
export const THUMBNAIL_HEIGHT_CUT = 1 - 0.26; // (13% cut on each side)

export const CATG_PREFIX = "categories";
export const TUT_PREFIX = "tutorials";

// The homepage thumbnail tutorial size relative to the screen size
export const HOMEPAGE_THUMBNAIL = {
  width: 640,
  height: 480,
  relativeWidth: 2048,
};

export const GET_SCREEN_SIZE = () => {
  const scrWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  const scrHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  return {
    width: scrWidth,
    height: scrHeight,
  };
};

export function DEBOUNCE<T>(func: (arg: T) => void, debounceTime = 100) {
  let timer: number;

  const debouncedCb = function(arg: T) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, debounceTime, arg);
  };

  debouncedCb.clearTimeout = () => {
    clearTimeout(timer);
  };

  return debouncedCb;
}
