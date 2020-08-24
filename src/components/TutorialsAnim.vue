<template>
  <div class="cards-container">
    <div class="box">
      <div
        class="pres-card"
        :id="thumbnailElId(idx)"
        v-for="(tutorial, idx) in tutorialsCards"
        :key="tutorial.id"
        :style="cardStyle(idx)"
        @mouseenter="showAuthorDescription(tutorial.id)"
        @mouseleave="hideAuthorDescription"
      >
        <img
          v-if="tutorial.thumbnailUrl"
          @load="thumbnailLoaded"
          :class="[
            focusedTutorialId === tutorial.id ? 'hovered' : '',
            'tut-thumbnail',
          ]"
          :src="tutorial.thumbnailUrl"
          :title="tutorial.title"
        />
        <span
          v-if="tutorial.authorDescription"
          :class="[
            focusedTutorialId === tutorial.id ? 'visible' : '',
            'tut-description',
          ]"
          >{{ tutorial.authorDescription }}</span
        >
      </div>
      <div class="center" :style="centerElementStyle">
        HELLO THERE, HOW ARE YOU MY DEAR?
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Tutorial } from "@/store/types";

import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
//import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger);

export default Vue.extend({
  created() {
    this.$store.dispatch("fetchThumbnails");
  },
  data() {
    return {
      tutorialsCards: this.$store.state.tutorials as Tutorial[],
      // Keep count of the loaded images until all are loaded
      loadedImagesCtr: 0,
      // How far the presentation cards will rotate (the whole .box container)
      rotationY: 315,
      // CounterClockwise rotation for the center element (so it stays put instead of rotating)
      centerCounterRot: 0,

      // The id of the currently focused tutorial (useful e.g. for showing the author description)
      focusedTutorialId: "",
    };
  },
  computed: {
    centerElementStyle(): { [K: string]: string } {
      return {
        transform: `rotateY(${this.centerCounterRot}deg)`,
      };
    },
    allThumbnailsLoaded(): boolean {
      return this.tutorialsCards.length === this.loadedImagesCtr;
    },
  },
  methods: {
    // When a thumbnail image is loaded, increment the loadedImagesCtr
    thumbnailLoaded() {
      this.loadedImagesCtr++;

      if (this.tutorialsCards && this.allThumbnailsLoaded) {
        this.createGsapAnimation();
      }
    },
    // Create the rotation animation of the tutorial cards
    // It is guaranteed that the thumbnails' images have loaded at this point
    createGsapAnimation() {
      const rotateY = this.rotationY * this.tutorialsCards.length;

      const setCounterRot = (rot: number) => {
        this.centerCounterRot = -rot;
      };

      // animate .box (rotate it)
      const boxContainer = this.$el.firstElementChild;

      const animationVars: gsap.TweenVars = {
        rotateY,
        yPercent: -85,
        ease: "linear",
        onUpdate() {
          const currRatio = (this as gsap.TweenVars).ratio;
          setCounterRot(currRatio * rotateY);
        },
      };

      // The scroll trigger parameter
      const scrollTrigger: gsap.plugins.ScrollTriggerInstanceVars = {
        markers: true,

        start: "top top",
        //end: "+=100%",
        trigger: boxContainer as Element,
        // pin the topmost container
        pin: this.$el,
        pinSpacing: false,
        scrub: 1,
        snap: {
          snapTo: currRatio => {
            // Snap
            const totalThumbnails = this.tutorialsCards.length;
            return Math.round(currRatio * totalThumbnails) / totalThumbnails;
          },
          delay: 0,
          duration: { min: 0.2, max: 0.35 },
        },
      };

      gsap.to(boxContainer, {
        ...animationVars,
        scrollTrigger,
      });
    },

    // Get the id of a thumbnail element given it's index
    thumbnailElId(idx: number) {
      return `thumbnail_${idx}`;
    },

    cardStyle(idx: number) {
      return {
        "--idx": idx,
      };
    },

    // The id of the currently hovered tutorial's thumbnail
    showAuthorDescription(cardId: string) {
      this.focusedTutorialId = cardId;
    },
    hideAuthorDescription() {
      this.focusedTutorialId = "";
    },
  },
});
</script>

<style scoped>
/** The top container => center the animation .box container */
.cards-container {
  /* height: auto !important; */

  display: flex;
  justify-content: center;

  user-select: none;
}

.box {
  /* position: relative; */
  /* margin: auto; */

  transform-style: preserve-3d;
  transform: translateZ(-50vw);
  transform-origin: 0 0 0;

  padding-bottom: 35vw;

  height: auto;
}

.center {
  position: absolute;
  top: 0;
  left: 0;
}

/** Stylize the rotating thumnail images */
img.tut-thumbnail {
  width: 100%;
  opacity: 0.5;

  clip-path: polygon(0% 13%, 100% 13%, 100% 87%, 0% 87%);
  transition: all 0.5s ease-in;
}

img.tut-thumbnail.hovered {
  opacity: 1;

  /* Blur out the thumbnail a little so the thumbnail text doesn't interfere with the description */
  filter: blur(6px);
}

img.tut-thumbnail:nth-child(even).hovered {
  transform: rotateY(30deg);
}
img.tut-thumbnail:nth-child(odd).hovered {
  transform: rotateY(-30deg);
}

/** The span element containing the added description for a particular description */
span.tut-description {
  position: absolute;
  top: 20%;
  left: -65%;
  width: 95%;

  font-size: 1.5rem;
  text-align: justify;
  text-indent: 1rem;

  font-family: "Gloria Hallelujah";
  color: rgba(190, 190, 190, 0.904);
  text-shadow: 1px 1px rgb(19, 19, 19);

  opacity: 0;
  transition: opacity 0.5s ease-in;
}

/** Make the description text color different on the dark theme */
.lights-off span.tut-description {
  color: rgb(223, 223, 223);
  text-shadow: 1px 1px rgb(98, 98, 98);
}

span.tut-description.visible {
  opacity: 1;
}

.pres-card {
  position: relative;
  width: 35vw;
  height: auto;

  transform-origin: 0 0;
  transform: rotateY(calc(var(--idx) * 45deg)) translateZ(35vw);
}
</style>
