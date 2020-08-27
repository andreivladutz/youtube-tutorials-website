// STORE MODULES:
export interface FirebaseModuleState {
  apiKey: string;

  isAdmin: boolean;
}

export interface AppStoreState {
  tutorials: Tutorial[];
  products: Product[];
  socialMedia: SocialMedia[];

  firebase?: FirebaseModuleState;
}

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
