// The directive options which adds the black margins cropping style logic
import { DirectiveOptions } from "vue";

export default {
  inserted(el) {
    el.style.clipPath = "polygon(0% 13%, 100% 13%, 100% 87%, 0% 87%)";
  },
} as DirectiveOptions;
