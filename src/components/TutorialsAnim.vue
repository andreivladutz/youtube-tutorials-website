<template>
  <div class="cards-container">
    <transition @enter="enter" :css="false">
      <div v-show="isVisible" class="box">
        <div
          class="pres-card"
          v-for="(tutorial, idx) in tutorialsCards"
          :key="tutorial.id"
          :style="cardStyle(idx)"
          @mouseenter="showAuthorDescription(tutorial.id)"
          @mouseleave="hideAuthorDescription"
        >
          <img
            v-if="tutorial.thumbnailUrl"
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
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { Tutorial } from "@/store/types";

gsap.registerPlugin(ScrollTrigger);
let timeline: gsap.core.Timeline;

export default Vue.extend({
  created() {
    this.$store.dispatch("fetchThumbnails");
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      tutorialsCards: this.$store.state.tutorials as Tutorial[],
      // How far the presentation cards will rotate
      rotationY: 45,
      // CounterClockwise rotation for the center element (so it stays put instead of rotating)
      centerCounterRot: 0,

      // The id of the currently focused tutorial (useful e.g. for showing the author description)
      focusedTutorialId: "",
    };
  },
  computed: {
    centerElementStyle(): { transform: string } {
      return {
        transform: `rotateY(${this.centerCounterRot}deg)`,
      };
    },
  },
  methods: {
    enter(el: HTMLElement, done: () => void) {
      done();
      setTimeout(() => {
        const rotateY = this.rotationY;
        const setCounterRot = (rot: number) => {
          this.centerCounterRot = -rot;
        };

        if (!timeline) {
          timeline = gsap.timeline({
            defaults: {
              ease: "linear",
              duration: 5,
              scrollTrigger: {
                markers: true,

                start: "top top",
                //end: "+=100%",
                trigger: ".pres-card",
                pin: true,
                scrub: true,
              },
            },
          });
        }

        timeline.to(el, {
          rotateY,
          repeat: -1,
          onUpdate() {
            setCounterRot(this.ratio * rotateY);
          },
        });
      }, 1000);
      //.play(0)
      // done();
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
  display: flex;
  justify-content: center;

  user-select: none;
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
  filter: blur(2px);
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
  left: -30%;
  width: 95%;

  font-size: 1.5rem;
  text-align: justify;
  text-indent: 1rem;

  font-family: "Gloria Hallelujah";
  color: rgb(223, 223, 223);
  text-shadow: 0px 1px rgb(98, 98, 98);

  opacity: 0;
  transition: opacity 0.5s ease-in;
}

span.tut-description.visible {
  opacity: 1;
}

.pres-card {
  position: absolute;
  width: 35vw;
  height: auto;

  transform-origin: 0 0;
  transform: rotateY(calc(var(--idx) * 45deg)) translateZ(35vw)
    translateY(calc(var(--idx) * 35vw));
}

.box {
  position: relative;
  /* margin: auto; */

  transform-style: preserve-3d;
  transform: perspective(300vh) translateX(50%);
  transform-origin: 0 0 0;

  height: 0;
  width: 0;
}
</style>
