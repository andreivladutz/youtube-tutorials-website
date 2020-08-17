<template>
  <div class="home">
    <button v-on:click.prevent="isVisible = !isVisible">Ello</button>
    <div class="cards-container">
      <transition @beforeEnter="beforeEnter" @enter="enter" :css="false">
        <div v-show="isVisible" class="box">
          <div
            class="pres-card"
            v-for="(color, idx) in cardsColors"
            :key="color + idx"
            :style="cardStyle(color, idx)"
          ></div>
          <div class="center" :style="centerElementStyle">
            HELLO THERE, HOW ARE YOU MY DEAR?
          </div>
        </div>
      </transition>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { gsap } from "gsap";

let timeline: gsap.core.Timeline;

export default Vue.extend({
  name: "Home",
  data() {
    return {
      isVisible: false,
      cardsColors: [
        "red",
        "orange",
        "green",
        "yellow",
        "cyan",
        "red",
        "orange",
        "green",
        "yellow",
        "cyan",
      ],
      // How far the presentation cards will rotate
      rotationY: 3600,
      // CounterClockwise rotation for the center element
      centerCounterRot: 0,
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
    beforeEnter() {
      if (timeline) {
        return;
      }

      timeline = gsap.timeline({
        defaults: {
          duration: 50,
          ease: "linear",
        },
      });
    },
    enter(el: HTMLElement, done: () => void) {
      const rotateY = this.rotationY;
      const setCounterRot = (rot: number) => {
        this.centerCounterRot = -rot;
      };

      timeline
        .to(el, {
          rotateY,
          repeat: -1,
          onUpdate() {
            setCounterRot(this.ratio * rotateY);
          },
        })
        .play(0)
        .then(done);
    },

    cardStyle(color: string, idx: number) {
      return {
        "--idx": idx,
        backgroundColor: color,
      };
    },
  },
  components: {
    HelloWorld,
  },
});
</script>

<style scoped>
.cards-container {
  display: flex;
  justify-content: center;
}

.pres-card {
  position: absolute;
  width: 200px;
  height: 200px;

  transform-origin: 0 0;
  transform: rotateY(calc(var(--idx) * 45deg)) translateZ(400px)
    translateY(calc(var(--idx) * 200px));
}

.box {
  position: relative;
  /* margin: auto; */

  transform-style: preserve-3d;
  transform: perspective(200vh) translateX(50%);
  transform-origin: 0 0 0;

  height: 0;
  width: 0;
}

button {
  display: block;
  margin: auto;
}
</style>
