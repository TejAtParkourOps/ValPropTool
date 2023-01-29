<template>
  <div class="d-flex flex-column align-items-center">
    <b-spinner label="Loading..." variant="secondary" class="mb-2"></b-spinner>
    <p class="text-secondary" v-if="message">
      <em>{{ message }}</em>
    </p>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    message: {
      type: String,
      default: "Loading...",
    },
  },
};
</script>
