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
  API_KEY: "AIzaSyCxfSVqp5OJg-g7wt4hHs2B-RBX12b5YIg",

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
