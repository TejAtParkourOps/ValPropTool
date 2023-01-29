<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "TextboxPromptModal",
  data() {
    return {
      title: "",
      prompt: "",
      placeholder: "",
      input: "",
      showModal: false,
      resolveHandler: null,
      rejectHandler: null,
    };
  },
  methods: {
    okay() {
      this.resolveHandler(this.input);
    },
    cancel() {
      this.rejectHandler();
    },
    show(title, prompt, placeholder, input) {
      this.title = title ?? "";
      this.prompt = prompt ?? "";
      this.placeholder = placeholder ?? "";
      this.input = input ?? "";
      this.showModal = true;
      return new Promise((resolve, reject) => {
        this.resolveHandler = resolve;
        this.rejectHandler = reject;
      });
    },
  },
};
</script>

<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    :title="title"
    v-model="showModal"
    @ok="okay"
    @cancel="cancel"
    :ok-disabled="input.length < 1"
  >
    <p v-if="prompt">{{ prompt }}</p>
    <b-form-input v-model="input" :placeholder="placeholder"></b-form-input>
  </b-modal>
</template>
