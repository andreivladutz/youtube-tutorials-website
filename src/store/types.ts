// STORE MODULES:
export interface FirebaseModuleState {
  apiKey: string;
  // Gabbitt's channel id
  channelId: string;

  isAdmin: boolean;
}

export interface YoutubeModuleState {
  tutorials: {
    [Id: string]: Tutorial;
  };
}

export interface AppStoreState {
  tutorials: Tutorial[];
  products: Product[];
  socialMedia: SocialMedia[];

  firebase?: FirebaseModuleState;
  youtube?: YoutubeModuleState;
}

export interface Tutorial {
  id: string;

  // The date and time that the playlist was created. The value is specified in ISO 8601 format.
  publishedAt: string;

  // The description added by the author for this tutorial (manually for the website)
  authorDescription?: string;

  title?: string;
  description?: string;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };

  // Every tutorial belongs to one or more categories
  // Keep their uids in an array
  categories?: [];
}

export interface PlaylistTutorial extends Tutorial {
  isPlaylist: boolean;
  // If the Tutorial is a playlist, it contains videos, so it has a dictionary where the keys are videos' ids
  playlistVideos: {
    [Id: string]: boolean;
  };
}

export interface VideoTutorial extends Tutorial {
  // A video can belong to a playlist, or can be general, belonging to the uploads (has no playlist)
  playlistId: string;

  // Its position inside the playlist
  position: number;
}

export class Category {
  uid: string;
  name: string = "New Category";

  tutorials: Tutorial[] = [];

  constructor(uid?: string) {
    if (!uid) {
      uid = this.generateUid();
    }

    this.uid = uid;
  }

  private generateUid(): string {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const LENGTH = 10;
    let uid = "";

    for (let i = 0; i < LENGTH; i++) {
      uid += characters[Math.floor(Math.random() * (characters.length - 1))];
    }

    return uid;
  }
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
    // The date and time that the playlist was created. The value is specified in ISO 8601 format.
    publishedAt: string;

    // For PlaylistItems responses
    playlistId?: string;
    position?: number;

    thumbnails: {
      default: ThumbnailResp;
      medium: ThumbnailResp;
      high: ThumbnailResp;
      standard: ThumbnailResp;
    };
  };

  // For PlaylistItems responses
  contentDetails?: {
    videoId: string;
    videoPublishedAt: string;
  };
}

export interface ThumbnailResp {
  url: string;
  width: number;
  height: number;
}

// Footer Social Media icons
export interface SocialMedia {
  screenReader: string;
  linkTo: string;
  // Path to the SVG
  iconPath: string;
}

// Products -> courses and such
export interface Product {
  // Link to external link
  linkTo: string;
  // Photo url
  linkPhoto: string;
  title: string;
  description: string;
}

// The form types used  for rendering the custom form component. Can be used for the admin or contact form
type FormType = "text" | "email" | "password" | "message";
export interface FormField {
  label: string;
  type: FormType;

  // In case of message i.e. textarea fields
  maxLength?: number;
}

export interface CustomFormParam {
  formTitle: string;
  buttonText: string;

  // The fields of the form in order
  fields: FormField[];
}

export interface FormWrapperParam extends CustomFormParam {
  title: string;
  paragraphText: string;
}

// The $data property resulted on CustomForm component after parsing the config object
export interface CustomFormData {
  // Simple input
  text?: string;
  password?: string;
  email?: {
    value: string;
    valid: boolean;
  };
  // The textarea
  message?: {
    text: string;
    maxLength: number;
  };
}
