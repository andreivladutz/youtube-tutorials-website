<template>
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer-inner">
        <div class="brand footer-brand">
          <a href="#">
            <img class="header-logo-image" src="@/assets/images/logo.png" alt="Logo" />
          </a>
        </div>
        <ul class="footer-links list-reset">
          <li>
            <a href="#">Made with &#10084;&#65039; by CiboDevz</a>
          </li>
        </ul>
        <ul class="footer-social-links list-reset">
          <li v-for="icon in socialMediaIcons" :key="icon.screenReader">
            <a :href="icon.linkTo" target="_blank">
              <span class="screen-reader-text">{{ icon.screenReader }}</span>
              <lazy-img
                :imgUrl="path(icon.iconPath)"
                :imgTitle="icon.screenReader"
                :imgAlt="icon.screenReader"
                width="1.5rem"
                height="1.5rem"
              />
            </a>
          </li>
        </ul>
        <div class="footer-copyright">Copyright &copy; 2020 Gabbitt Media, All Rights Reserved</div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
  import Vue from "vue";
  import LazyLoadImg from "./LazyLoadImg.vue";
  import { SocialMedia } from "@/store/types";

  export default Vue.extend({
    components: {
      ["lazy-img"]: LazyLoadImg
    },
    computed: {
      socialMediaIcons(): SocialMedia[] {
        return this.$store.state.socialMedia;
      }
    },
    methods: {
      path(filename: string): string {
        return require(`@/assets/images/social-media/${filename}.svg`);
      }
    }
  });
</script>
