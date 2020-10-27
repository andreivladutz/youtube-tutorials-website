<template>
  <div
    :style="
      `
    --thumbnail-width: ${thumbnailWidth}px;
    --thumbnail-height: ${thumbnailHeight}px;
    --no-thumbnails: ${tutorialsCards.length};
    `
    "
    class="cards-container"
  >
    <div class="box" ref="box">
      <!-- <div class="center" ref="center" :style="centerElementStyle">
        HELLO THERE, HOW ARE YOU MY DEAR?
      </div> -->
      <div
        class="pres-card"
        :id="thumbnailElId(idx)"
        v-for="(tutorial, idx) in tutorialsCards"
        :key="tutorial.id"
        :style="cardStyle(idx)"
      >
        <img
          v-thumbnail
          @load="thumbnailLoaded"
          class="tut-thumbnail"
          :src="tutorial.thumbnail.url"
          :title="tutorial.title"
          :alt="tutorial.title"
        />
      </div>
    </div>
    <!-- End the .box container -->
    <transition name="fade">
      <div
        v-if="snappedTutorial"
        class="snapped-card"
        @mouseenter="
          showAuthorDescription(snappedTutorial && snappedTutorial.id)
        "
        @mouseleave="hideAuthorDescription"
      >
        <img
          :class="[
            focusedTutorialId === snappedTutorial.id ? 'hovered' : '',
            'tut-thumbnail',
          ]"
          :src="snappedTutorial.thumbnail.url"
          :title="snappedTutorial.title"
          :alt="snappedTutorial.title"
        />
        <span
          v-if="snappedTutorial.authorDescription"
          :class="[
            focusedTutorialId === snappedTutorial.id ? 'visible' : '',
            'tut-description',
          ]"
          >{{ snappedTutorial.authorDescription }}</span
        >
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import { Tutorial, AppStoreState } from "@/store/types";

import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { DEBOUNCE, GET_SCREEN_SIZE, HOMEPAGE_THUMBNAIL } from "@/CST";
//import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger);

export default Vue.extend({
  async created() {
    await this.fetchFromFirebase();
  },
  mounted() {
    window.addEventListener(
      "resize",
      DEBOUNCE(() => {
        this.resetThumbnailSize();

        // If the thumbnails are loaded, we need to recreate the gsap animation
        if (this.allThumbnailsLoaded) {
          this.createGsapAnimation();
        }
      })
    );
    this.resetThumbnailSize();
  },
  data() {
    return {
      // Keep count of the loaded images until all are loaded
      loadedImagesCtr: 0,
      // How far the presentation cards will rotate (the whole .box container)
      rotationY: 315,
      thumbnailWidth: 0,
      thumbnailHeight: 0,
      // CounterClockwise rotation for the center element (so it stays put instead of rotating)
      // centerCounterRot: 0,
      // centerCounterYTravel: 0,

      // The id of the currently focused tutorial (useful e.g. for showing the author description)
      focusedTutorialId: "",
      // The currently snapped tutorial's index
      currSnappedTutIdx: -1,
    };
  },
  computed: {
    ...mapState({
      tutorialsCards: state =>
        Object.values(
          (state as AppStoreState).firebase!.tutorials
        ) as Tutorial[],
    }),
    // centerElementStyle(): { [K: string]: string } {
    //   return {
    //     transform: `rotateY(${this.centerCounterRot}deg)`,
    //     top: `${this.centerCounterYTravel}px`,
    //   };
    // },
    snappedTutorial(): Tutorial {
      return this.tutorialsCards[this.currSnappedTutIdx];
    },
    allThumbnailsLoaded(): boolean {
      return (
        this.tutorialsCards &&
        this.tutorialsCards.length === this.loadedImagesCtr
      );
    },
  },
  methods: {
    ...mapActions({
      fetchFromFirebase: "firebase/fetchFromFirebase",
    }),
    resetThumbnailSize() {
      const ratio = GET_SCREEN_SIZE().width / HOMEPAGE_THUMBNAIL.relativeWidth;

      this.thumbnailWidth = HOMEPAGE_THUMBNAIL.width * ratio;
      this.thumbnailHeight = HOMEPAGE_THUMBNAIL.height * ratio;
    },
    // When a thumbnail image is loaded, increment the loadedImagesCtr
    thumbnailLoaded() {
      this.loadedImagesCtr++;

      if (this.allThumbnailsLoaded) {
        this.createGsapAnimation();

        this.currSnappedTutIdx = 0;
      }
    },
    // Create the rotation animation of the tutorial cards
    // It is guaranteed that the thumbnails' images have loaded at this point
    createGsapAnimation() {
      // animate .box (rotate it)
      const boxContainer = this.$refs.box;
      const existingScroll = ScrollTrigger.getById("trigger");

      if (existingScroll) {
        existingScroll.kill(true);
      }

      gsap.killTweensOf(boxContainer);

      const rotateY = this.rotationY * this.tutorialsCards.length;
      const totalThumbnails = this.tutorialsCards.length;
      const yAxisDist = -this.thumbnailHeight * this.tutorialsCards.length;

      // const setCounterRot = (rot: number) => {
      //   this.centerCounterRot = -rot;
      // };
      // const setCounterYTravel = (yDist: number) => {
      //   this.centerCounterYTravel = -yDist;
      // };

      const animationVars: gsap.TweenVars = {
        rotateY,
        // yPercent: -90,
        y: yAxisDist,
        ease: "linear",
        // onUpdate() {
        //   const currRatio = (this as gsap.TweenVars).ratio;
        //   setCounterRot(currRatio * rotateY);
        //   setCounterYTravel(currRatio * yAxisDist);
        // },
      };

      const snapStepSize = 1 / totalThumbnails;
      // The scroll trigger parameter
      const scrollTrigger: gsap.plugins.ScrollTriggerInstanceVars = {
        // Show scroller-start and scroller-end
        // markers: true,
        id: "trigger",
        start: "top top",
        //end: "+=100%",
        trigger: boxContainer as Element,
        // pin the topmost container
        pin: this.$el,
        pinSpacing: false,
        scrub: 1,
        snap: {
          snapTo: snapStepSize,
          delay: 0,
          duration: { min: 0.2, max: 0.35 },
        },
        // Add a snapping callback that identifies the current snapped tutorial
        onSnapComplete: DEBOUNCE(({ progress }) => {
          this.currSnappedTutIdx = Math.round(progress / snapStepSize);
        }, 250),
        onUpdate: self => {
          (self.vars.onSnapComplete as ReturnType<
            typeof DEBOUNCE
          >).clearTimeout();
          this.currSnappedTutIdx = -1;
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
  --snapped-tut-width: 90vw;
  height: calc(var(--no-thumbnails) * var(--thumbnail-height)) !important;
  /* height: inherit !important; */

  display: flex;
  justify-content: center;

  user-select: none;
}

.box {
  /* position: relative; */
  /* margin: auto; */

  transform-style: preserve-3d;
  transform: rotateY(2deg) translateZ(-50vw);
  transform-origin: 0 0 0;

  padding-bottom: var(--thumbnail-width);
  width: var(--thumbnail-width);

  height: auto;
}

/* .center {
  position: absolute;
  top: 0;
} */

/** Stylize the rotating thumnail images */
img.tut-thumbnail {
  width: 100%;
  opacity: 0.5;

  /* transition: all 0.5s ease-in; */
}
/* 
img.tut-thumbnail.hovered {
  opacity: 1; */

/* Blur out the thumbnail a little so the thumbnail text doesn't interfere with the description */
/* filter: blur(6px);
} */

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
  left: 0;
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
  width: var(--thumbnail-width);
  height: auto;

  transform-origin: 0 0;
  transform: rotateY(calc(var(--idx) * 45deg))
    translateZ(var(--thumbnail-width));

  transition: width 0.5s;
}

.snapped-card {
  position: fixed;
  top: 50vh;
  left: 50%;

  margin-left: calc(var(--snapped-tut-width) * -0.5);
  margin-top: calc(var(--snapped-tut-width) * -0.375);
  width: var(--snapped-tut-width);
  transition: all 0.5s ease-in;
}

.fade-enter-active.snapped-card,
.fade-leave-active.snapped-card {
  width: var(--snapped-tut-width);
}

.fade-enter.snapped-card,
.fade-leave-to.snapped-card {
  width: var(--thumbnail-width);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0.2;
}

.snapped-card > img.tut-thumbnail {
  opacity: 1;

  /* Blur out the thumbnail a little so the thumbnail text doesn't interfere with the description */
  filter: blur(6px);

  transition: all 0.5s ease-in;
}
</style>
