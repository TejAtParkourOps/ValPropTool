import { RouterLink } from 'vue-router';

<template>
  <div class="footer bg-dark text-white">
    <div />
    <!-- <div class="links">
            <router-link to="/about" class="mr-4">Privacy Policy</router-link>
            <router-link to="/about">About</router-link>
        </div> -->
  </div>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 1.3rem 1.7rem;
  margin-top: 4rem;
  a {
    color: gray;
    &:hover {
      color: white;
    }
  }
}
</style>
