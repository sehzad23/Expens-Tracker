<template>
  <div>
    <NavBar />
    <FooterContent />
  </div>
</template>
<script>
import NavBar from "./components/NavBar.vue";
import FooterContent from "./components/FooterContent.vue";
export default {
  name: "App",
  components: {
    NavBar,
    FooterContent,
  },
};
</script>
<style lang="">
</style>