import { Commit } from "vuex";
import { AppStoreState, Tutorial } from "./types";

// Get a tutorial's reference having tutorialId whether it is inside the yt module or the firebase module
export function getTutorialReference(state: AppStoreState, tutorialId: string) {
  return (state.youtube?.tutorials[tutorialId] ||
    state.firebase?.tutorials[tutorialId]) as Tutorial;
}

// Payloads that contain a tutorialId or categoryId prop usually modify that tutorial / category
export function recordModif(
  state: AppStoreState,
  commit: Commit,
  payload: { tutorialId?: string; categoryId?: string }
) {
  if (payload.categoryId) {
    commit("firebase/recordModifications", {
      modifiedObj: state.categories[payload.categoryId],
    });
  }

  if (payload.tutorialId) {
    commit("firebase/recordModifications", {
      modifiedObj: getTutorialReference(state, payload.tutorialId),
    });
  }
}
