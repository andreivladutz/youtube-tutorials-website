// Fetch 20 media items at once instead of the default 5 per request
const RESULTS_PER_PAGE = 20;

function ENDPOINT_URL(
  mediaId: "videos" | "playlists",
  ids: string[],
  apiKey: string,
  pageToken?: string
) {
  const idString = ids.length
    ? ids.reduce((idStr, currId) => `${idStr},${currId}`)
    : "";
  // If we are fetching videos, we want to fetch them by their ids.
  // Otherwise, if we are fetching playlists we want to fetch them all for Gabbit's channel
  const idEndpoint = `${mediaId === "videos" ? "id" : "channelId"}=${idString}`;

  return `https://www.googleapis.com/youtube/v3/${mediaId}?part=snippet&${idEndpoint}&maxResults=${RESULTS_PER_PAGE}&key=${apiKey}${
    pageToken ? `&pageToken=${pageToken}` : ""
  }`;
}

export default {
  VIDEO_ENDPOINT(videosIds: string[], apiKey: string, pageToken?: string) {
    return ENDPOINT_URL("videos", videosIds, apiKey, pageToken);
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

export const REALTIME_DB = {};
