<template>
  <div class="lights-toggle">
    <input
      id="lights-toggle"
      type="checkbox"
      name="lights-toggle"
      class="switch"
      :checked="isLightTheme"
      @click="isLightTheme = !isLightTheme"
    />
    <label for="lights-toggle" class="text-xxs"
      ><span>Toggle Theme</span></label
    >
  </div>
</template>

<script lang="ts">
import { RootVueApp } from "@/main";
import Vue from "vue";

export default Vue.extend({
  computed: {
    isLightTheme: {
      get() {
        return (this.$root as RootVueApp).isLightTheme;
      },

      set(value: boolean) {
        (this.$root as RootVueApp).isLightTheme = value;
      },
    },
  },
  watch: {
    isLightTheme(newValue) {
      if (newValue) {
        document.body.classList.remove("lights-off");
      } else {
        document.body.classList.add("lights-off");
      }
    },
  },
});
</script>

<style scoped>
.text-xxs {
  font-size: 0.75rem;
}

.lights-toggle {
  position: absolute;
  right: 0.4rem;
  top: 0;
  z-index: 2;

  color: #292828df;
}

.lights-off .lights-toggle {
  color: #ebe8e8df;
}
</style>
