export interface Tutorial {
  id: string;
  isPlaylist?: boolean;

  // The description added by the author for this tutorial (manually for the website)
  authorDescription?: string;

  title?: string;
  description?: string;
  thumbnailUrl?: string;
}

// The json response returned from the yt endpoint
export interface YouTubePlaylistQueryResp {
  // ... Only ilustrating the used props
  // There are more pages to get
  nextPageToken: string;
  items: Array<PlaylistResp>;
}

export interface PlaylistResp {
  // Playlist's id
  id: string;

  snippet: {
    title: string;
    description: string;

    thumbnails: {
      default: ThumbnailResp;
      medium: ThumbnailResp;
      high: ThumbnailResp;
      standard: ThumbnailResp;
    };
  };
}

export interface ThumbnailResp {
  url: string;
  width: number;
  height: number;
}
