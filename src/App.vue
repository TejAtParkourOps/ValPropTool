
<template>
  <div id="app" oncontextmenu="return false;">
    <NavBar />
    <div class="wrapper">
      <router-view :key="$route.path"/>
    </div>
    <Footer />
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue';
  import Footer from './components/Footer.vue';
  export default {
    components: {NavBar, Footer}
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    min-height: 100vh;
  }
</style>
