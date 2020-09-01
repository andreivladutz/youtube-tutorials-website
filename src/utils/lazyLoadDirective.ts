// The directive options which lazy loads an image
import { DirectiveOptions } from "vue";

type ElCbPair = {
  element: HTMLElement;
  cb: (el: HTMLElement) => void;
};

// An array of {element, cb} pair where element is the html element with the registered directive
const elementCbPairs: ElCbPair[] = [];

function findAndCallElementsCb(el: HTMLElement) {
  const cbPair = elementCbPairs.find(pair => pair.element === el);

  if (cbPair) {
    cbPair.cb(el);
  }
}

// Callback for the intersection callback
// Return the cb with closure over the html element being observed
const intersectCb: IntersectionObserverCallback = (entries, observer) => {
  entries.forEach(entry => {
    const el = entry.target as HTMLElement;

    if (entry.isIntersecting) {
      findAndCallElementsCb(el);
      observer.unobserve(el);
    }
  });
};

// Create only one intersection observer (if supported)
const intersectObs =
  window.IntersectionObserver &&
  new IntersectionObserver(intersectCb, {
    root: null,
    rootMargin: "500px",
  });

// Observe the intersection with another object via the main observer
function observe(el: HTMLElement) {
  intersectObs.observe(el);
}

export default {
  inserted: (el, binding) => {
    const cb = binding.value;

    // If no callback is passed to the directive, fail fast
    if (!cb || typeof cb !== "function") {
      throw "The value passed to the v-lazyload directive should be a function callback!";
    }

    elementCbPairs.push({
      element: el,
      cb,
    });

    // Detect if observer supported
    if (window.IntersectionObserver) {
      observe(el);
    } else {
      cb(el);
    }
  },
} as DirectiveOptions;
