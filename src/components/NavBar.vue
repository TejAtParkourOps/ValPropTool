<template>
  <div class="navbar bg-primary shadow">
    <RouterLink to="/" class="title">Value Proposition Tool</RouterLink>
    <div class="links">
      <!-- <RouterLink to="/create" class="text-light mr-4">Create</RouterLink> -->
      <RouterLink to="/propositions" class="mr-4">My Propositions</RouterLink>
      <RouterLink to="/user">{{
        userInfoStore.userInfo ? "My Account" : "Login"
      }}</RouterLink>
    </div>
  </div>
</template>

<script>
import { useUserInfo } from "@/plugins/userInfo";
import { RouterLink } from "vue-router";

export default {
  name: "NavBar",
  components: { RouterLink },
  setup() {
    const userInfoStore = useUserInfo();
    return {
      userInfoStore,
    };
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  padding: 1.7rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
}

.links {
  a {
    color: white;
    &:hover {
      color: white;
    }
  }
}
</style>
