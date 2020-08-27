function ENDPOINT_URL(
  mediaId: "videos" | "playlists",
  ids: string[],
  apiKey: string,
  pageToken?: string
) {
  const idString = ids.reduce((idStr, currId) => {
    return `${idStr},${currId}`;
  }, "");

  return `https://www.googleapis.com/youtube/v3/${mediaId}?part=snippet&id=${idString}&key=${apiKey}${
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

export const REALTIME_DB = {
  KEY_PATH: "ytApiKey",
};
